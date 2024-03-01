from captain.parser.bool_parser.bool_parser import variable_symbols
from captain.parser.bool_parser.expressions.exceptions import InvalidCharacter


def validate_name(name: str):
    for c in name:
        if c not in variable_symbols:
            raise InvalidCharacter(
                f"{c}, only {[s for s in variable_symbols]} is allowed"
            )
