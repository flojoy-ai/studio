from abc import ABC, abstractmethod
from typing import Union, Type, List, Any, cast
from captain.parser.bool_parser.expressions.exceptions import (
    TargetNumberMismatch,
    TestNotRan,
)


class Operator:
    def __init__(self, operator: str):
        self.operator = operator

    def __repr__(self) -> str:
        return f"Operator({self.operator})"

    def __eq__(self, __value: object) -> bool:
        if isinstance(__value, Operator):
            return self.operator == __value.operator
        return False

    def __hash__(self) -> int:
        return hash(self.operator)


class Variable:
    def __init__(self, pass_or_fail: bool, exec_time: float):
        self.pass_or_fail = pass_or_fail
        self.exec_time = exec_time


ReturnTypes = Union[Type[bool], Type[Variable], Type[str], Type[float]]

ExpectAlias = list[Union[ReturnTypes, Operator]]

SymbolTableType = dict[str, Variable]


class Expression(ABC):
    expects: ExpectAlias = NotImplemented  # the sequence to match, for example a AND expression would need be represented by [bool, Operator, bool] because it evaluates on each side
    returns: ReturnTypes = NotImplemented  # type: ignore  What the operation() method is returning

    def __init__(self, targets: List["Expression"]):
        self.targets = targets

    def __repr__(self):
        return self.__class__.__name__ + " ".join([self.targets.__str__()])

    @abstractmethod
    def operation(self) -> Any:
        pass


# basically a null
class Empty(Expression):
    def __init__(self):
        pass

    def operation(self) -> None:
        pass


# special class to retrieve variable information (in this case, the test run information)
class Identifier(Expression):
    expects: ExpectAlias = [str]
    returns: ReturnTypes = Variable

    def __init__(self, target: str, symbol_table: SymbolTableType):
        self.target = target
        self.symbol_table = symbol_table

    def __repr__(self) -> str:
        return f"Identifier({self.target})"

    def operation(self) -> Variable:
        try:
            return self.symbol_table[self.target]
        except KeyError:
            raise TestNotRan("could not find test name in symbol table")


class Literal(Expression):
    expects: ExpectAlias
    returns: ReturnTypes

    @staticmethod
    def allows(candidate: str) -> bool:
        raise NotImplementedError

    def __init__(self, target: str):
        self.target = target

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.target})"

    def operation(self) -> Any:
        raise NotImplementedError


class BooleanLiteral(Literal):
    @staticmethod
    def allows(candidate: str) -> bool:
        return candidate in {"True", "False"}

    expects: ExpectAlias = [str]
    returns: ReturnTypes = bool

    def __init__(self, target: str):
        self.target = target
        if not BooleanLiteral.allows(target):
            raise TypeError('boolean literal expects "True" or "False"')

    def operation(self) -> bool:
        return self.target == "True"


class NumericLiteral(Literal):
    @staticmethod
    def allows(candidate: str) -> bool:
        try:
            float(candidate)
        except ValueError:
            return False
        return True

    expects: ExpectAlias = [str]
    returns: ReturnTypes = float

    def __init__(self, target: str):
        self.target = target
        if not NumericLiteral.allows(target):
            raise TypeError('boolean literal expects "True" or "False"')

    def operation(self) -> float:
        return float(self.target)


class UnaryExpression(Expression):
    def __init__(self, targets: List[Expression], *args, **kwargs):
        if len(targets) != 1:
            raise TargetNumberMismatch("unary expression expects 1")
        super().__init__(targets=targets, *args, **kwargs)
        self.targets = targets


class BinaryExpression(Expression):
    def __init__(self, targets: List[Expression], *args, **kwargs):
        if len(targets) != 2:
            raise TargetNumberMismatch("binary expression expects 2")
        super().__init__(targets=targets, *args, **kwargs)
        self.targets = targets


ExpressionType = Union[UnaryExpression, BinaryExpression]


class Not(UnaryExpression):
    expects: ExpectAlias = [Operator("!"), bool]
    returns: ReturnTypes = bool

    def operation(self) -> bool:
        return not self.targets[0].operation()


class GetPassFail(UnaryExpression):
    expects: ExpectAlias = [Operator("$"), Variable]
    returns: ReturnTypes = bool

    def operation(self) -> bool:
        target = self.targets[0]
        target = cast(Identifier, target)
        return target.operation().pass_or_fail


class And(BinaryExpression):
    expects: ExpectAlias = [bool, Operator("&"), bool]
    returns: ReturnTypes = bool

    def operation(self) -> bool:
        return self.targets[0].operation() and self.targets[1].operation()


class Or(BinaryExpression):
    expects: ExpectAlias = [bool, Operator("|"), bool]
    returns: ReturnTypes = bool

    def operation(self) -> bool:
        return self.targets[0].operation() or self.targets[1].operation()


class LeftParenthesis:
    def __init__(self):
        pass


class RightParenthesis:
    def __init__(self):
        pass


PARANTHESES_TO_CLASS: dict[
    str, Union[Type[LeftParenthesis], Type[RightParenthesis]]
] = {
    "(": LeftParenthesis,
    ")": RightParenthesis,
}

TOKEN_TO_CLASS: dict[str, Type[Expression]] = {
    "!": Not,
    "&": And,
    "|": Or,
    "$": GetPassFail,
}
