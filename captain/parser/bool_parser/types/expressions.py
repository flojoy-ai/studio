from typing import Union
from captain.parser.bool_parser.expressions.models import (
    Identifier,
    LeftParenthesis,
    Operator,
    RightParenthesis,
    Literal,
)

Token = Union[Operator, LeftParenthesis, RightParenthesis, Identifier, Literal]
