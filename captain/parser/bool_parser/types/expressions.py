from typing import Callable, List, Optional, Union
from ..expressions.models import (
    Identifier,
    LeftParanthesis,
    Operator,
    RightParanthesis,
    Literal,
)

Token = Union[Operator, LeftParanthesis, RightParanthesis, Identifier, Literal]


class Result:
    def __init__(
        self, success: bool, value: Optional[List[Token]], rest: Optional[List[Token]]
    ):
        self.sucess = success
        self.value = value
        self.rest = rest


Combinator = Callable[[List[Token]], Result]
