from flojoy import (
    flojoy,
    OrderedPair,
    OrderedTriple,
    Matrix,
)
from typing import Literal
from dataclasses import dataclass
import numpy as np


@dataclass(frozen=True)  # Multiple outputs
class FooOutput:
    output1: OrderedPair
    output2: Matrix


@flojoy(deps={"torch": "0.25.2"})
def FOO(
    a: OrderedPair | OrderedTriple | Matrix,  # Different potential types for input
    b: Matrix,
    quux: str | int,
    asd: str | int | list[str] | list[int],  # Different potential types for parameter
    baz: Literal["a", "b", "c"] = "b",  # Select Param
    bar: float = 1.0,  # Default values
) -> FooOutput:
    return FooOutput(
        output1=OrderedPair(x=np.array([]), y=np.array([])),
        output2=Matrix(m=np.array([])),
    )
