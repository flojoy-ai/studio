from captain.parser.bool_parser.expressions.models import (
    And,
    GetPassFail,
    Not,
    Or,
    Expression,
)


class Rule:
    def __init__(self, order_of_operations):
        self.order_of_operations: list[set[Expression]] = order_of_operations


rules = Rule(
    order_of_operations=[
        {GetPassFail},
        {Not},
        {And},
        {Or},
    ]
)
