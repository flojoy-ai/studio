from flojoy_mock import (
    flojoy,
    DataContainer,
    OrderedPair,
    OrderedTriple,
    Matrix,
    Dataframe,
)
from typing import Literal
from dataclasses import dataclass


@dataclass(frozen=True)
class FooOutput:
    output1: OrderedPair
    output2: Matrix


@flojoy
def FOO(
    # a: OrderedPair | OrderedTriple | Matrix,
    b: Matrix,
    # quux: str | int,
    # asd: str | int | list[str] | list[int],
    # baz: Literal["a", "b", "c"] = "b",
    # bar: float = 1.0,
) -> FooOutput:
    return FooOutput(output1=OrderedPair(), output2=Matrix())
