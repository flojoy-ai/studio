from typing import List
from captain.parser.bool_parser.expressions.exceptions import (
    EarlyIdentifier,
    InvalidIdentifier,
)
from captain.parser.bool_parser.expressions.models import Identifier, SymbolTableType
from captain.parser.bool_parser.types.expressions import Token
from captain.parser.bool_parser.types.token_verifier import (
    TokenVerifier,
    VerificationContainer,
)


def _verify_identifiers(
    tokens: List[Token], symbol_table: SymbolTableType, all_identifiers: set[str]
):
    for token in tokens:
        if not isinstance(token, Identifier):
            continue
        id_token = token.target
        if id_token not in all_identifiers:
            raise InvalidIdentifier(id_token)
        if id_token not in symbol_table.keys():
            raise EarlyIdentifier(id_token)


def _verify(
    verification_container: VerificationContainer, verifiers: List[TokenVerifier]
):
    for verifier in verifiers:
        verifier(**verification_container.__dict__)
