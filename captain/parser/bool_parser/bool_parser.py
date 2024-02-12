import string
from typing import Union, List, Type
from captain.parser.bool_parser.types.expressions import Token
from functools import partial

from captain.parser.bool_parser.expressions.models import (
    PARANTHESES_TO_CLASS,
    BooleanLiteral,
    NumericLiteral,
    LeftParenthesis,
    Operator,
    ReturnTypes,
    RightParenthesis,
    SymbolTableType,
    Empty,
)
from captain.parser.bool_parser.expressions.exceptions import (
    InvalidCharacter,
    InvalidExpression,
    InvalidIdentifier,
    MatchError,
    MissingLeftParenthesis,
    MissingRightParenthesis,
)
from captain.parser.bool_parser.expressions.models import (
    Expression,
    Identifier,
    TOKEN_TO_CLASS,
)
from captain.parser.bool_parser.parser_config import rules

parantheses = set(PARANTHESES_TO_CLASS.keys())
operation_symbols = set(TOKEN_TO_CLASS.keys())
variable_symbols = set(string.ascii_letters + string.digits + "_./:")
boolean_literal_symbols = set("TrueFalse")
numeric_literal_symbols = set(string.digits + ".")
language = {
    *parantheses,
    *boolean_literal_symbols,
    *operation_symbols,
    *variable_symbols,
}

ParseItem = Union[Token, Expression]


def _tokenize(s: str, symbol_table: SymbolTableType) -> list[Token]:
    """
    Tokenizes the string input from the user
    """

    def _match_op_symbol(ptr: int) -> tuple[Operator, int]:
        extend = 0
        while (
            ptr + extend + 1 <= len(s)
            and s[ptr : ptr + extend + 1] in TOKEN_TO_CLASS.keys()
        ):
            extend += 1
        c = s[ptr : ptr + extend]
        return Operator(c), extend

    def _match_literal_or_var(ptr: int, allowed_symbols: set[str]):
        start = ptr
        while ptr < len(s) and s[ptr] in allowed_symbols:
            ptr += 1
        if ptr < len(s) and s[ptr] not in language:
            raise InvalidCharacter(s[ptr])
        return start, ptr

    tokens: List[Token] = []
    s = s.replace(" ", "")  # remove whitespace
    ptr = 0
    while ptr < len(s):
        c = s[ptr]
        if c not in language:
            raise InvalidCharacter(c)

        if c in parantheses:
            tokens.append(PARANTHESES_TO_CLASS[c]())
            ptr += 1
            continue

        if c in operation_symbols:
            operator, extend = _match_op_symbol(ptr)
            tokens.append(operator)
            ptr += extend
            continue

        # match, then check if literal
        allowed_symbols = {
            *numeric_literal_symbols,
            *boolean_literal_symbols,
            *variable_symbols,
        }
        start_ptr, end_ptr = _match_literal_or_var(ptr, allowed_symbols)
        token_str = s[start_ptr:end_ptr]
        if BooleanLiteral.allows(token_str):
            tokens.append(BooleanLiteral(token_str))
        elif NumericLiteral.allows(token_str):
            tokens.append(NumericLiteral(token_str))
        else:
            if token_str not in symbol_table.keys():
                raise InvalidIdentifier(token_str)
            tokens.append(Identifier(token_str, symbol_table))
        ptr = end_ptr

    return tokens


# class used for matching rules/operators on the same level of priority
class TrieNode:
    def __init__(
        self,
        value: Union[ReturnTypes, Operator, None] = None,
        children: dict[Union[ReturnTypes, Operator], "TrieNode"] = {},
        is_end: bool = False,
    ):
        self.value = value
        self.children = children
        self.is_end = is_end


# class used to store details of a match
class Match:
    def __init__(
        self,
        matched: bool,
        start_idx: int = -1,
        end_idx: int = -1,
        expression: Expression = Empty(),
    ):
        self.matched = matched
        self.start_idx = start_idx
        self.end_idx = end_idx
        self.expression = expression


def _build_ast(tokens: list[Token], symbol_table: SymbolTableType) -> Expression:
    """
    This function builds the abstract syntax tree for the boolean expression.
    """

    """
    ____________________________
    Helper Function definitions:
    """
    recurse = partial(_build_ast, symbol_table=symbol_table)

    def _get_subexpressions(tokens: list[Token]):
        sub_exps: List[tuple[int, int]] = []  # default value necessary
        stack: List[int] = []
        for i in range(len(tokens)):
            match tokens[i]:
                case LeftParenthesis():
                    stack.append(i)
                case RightParenthesis():
                    try:
                        start_idx = stack.pop()
                    except IndexError:
                        raise MissingLeftParenthesis(
                            "empty stack during parsing of subexpression"
                        )
                    if len(stack) == 0:
                        sub_exps.append((start_idx, i))
        if len(stack) != 0:
            raise MissingRightParenthesis(
                "found unclosed paranthesis at the end of parsing subexpression"
            )
        return sub_exps

    def _match(
        to_parse: List[ParseItem],
        to_match: set[Expression],
    ) -> Match:
        def _build_trie(to_match: set[Expression]):
            root = TrieNode(children={}, is_end=False)
            for expression in to_match:
                m_list = expression.expects  # list/sequence to match
                cur_node = root
                for match_item in m_list:
                    if match_item not in cur_node.children:
                        cur_node.children[match_item] = TrieNode(match_item, {}, False)
                    cur_node = cur_node.children[match_item]
                cur_node.is_end = True
            return root

        def _is_a_match(
            cur_idx: int, trie: TrieNode
        ) -> tuple[bool, list[Expression], Type[Expression]]:
            cur_node = trie
            targets = []
            expr_type: Type[Expression] = None  # type: ignore
            try:
                while not cur_node.is_end:
                    cur_item = to_parse[cur_idx]
                    item_matcher = (
                        cur_item.returns
                        if isinstance(cur_item, Expression)
                        else cur_item
                    )

                    if item_matcher not in cur_node.children:
                        return False, None, None  # type: ignore
                    cur_node = cur_node.children[item_matcher]
                    cur_idx += 1
                    if isinstance(cur_item, Operator):
                        expr_type = TOKEN_TO_CLASS[cur_item.operator]
                    else:
                        targets.append(cur_item)

                if not expr_type:
                    raise MatchError(
                        "could not find the expression type (was an operator provided?)"
                    )
                return True, targets, expr_type
            except IndexError:
                return False, None, None  # type: ignore

        trie = _build_trie(to_match)
        for i in range(0, len(to_parse)):
            matched, targets, expr_type = _is_a_match(i, trie)
            if matched:
                expression = expr_type(targets)
                return Match(matched, i, i + len(expr_type.expects), expression)

        return Match(False)

    """
    ____________________________
    """
    to_parse: List[ParseItem] = []

    # step 1: parse all subexpressions first
    sub_exps = (
        [(-2, -1)] + _get_subexpressions(tokens) + [(len(tokens), len(tokens) + 1)]
    )
    i = -2
    for sub_exp in sub_exps:
        to_parse += tokens[i : sub_exp[0]]
        sublist = tokens[sub_exp[0] + 1 : sub_exp[1]]
        if sublist:
            to_parse += [recurse(sublist)]
        i = sub_exp[1] + 1

    # step 2: parse in order defined by parser_config
    for expressions in rules.order_of_operations:
        match_obj = _match(to_parse, expressions)
        while match_obj.matched:
            to_parse = (
                to_parse[: match_obj.start_idx]
                + [match_obj.expression]
                + to_parse[match_obj.end_idx :]
            )
            match_obj = _match(to_parse, expressions)

    # step 3: verify that expression was successfully parsed
    if len(to_parse) != 1 or not isinstance(to_parse[0], Expression):
        raise InvalidExpression(f"At the end of parse, got: {to_parse}")

    return to_parse[0]


def _evaluate_ast(_ast: Expression) -> bool:
    return _ast.operation()


def eval_expression(input: str, symbol_table: SymbolTableType) -> bool:
    """
    Evaluates the input expression with the given symbol_table.
    Necessarily returns a boolean value.
    """
    tokens = _tokenize(input, symbol_table)
    ast = _build_ast(tokens, symbol_table)
    return _evaluate_ast(ast)
