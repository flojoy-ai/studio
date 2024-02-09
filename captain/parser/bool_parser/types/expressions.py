from typing import Union
from ..expressions.models import (
    Identifier,
    LeftParenthesis,
    Operator,
    RightParenthesis,
    Literal,
)

Token = Union[Operator, LeftParenthesis, RightParenthesis, Identifier, Literal]
