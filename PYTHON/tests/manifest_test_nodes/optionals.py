from flojoy import flojoy, DataContainer, OrderedPair, OrderedTriple, Matrix
from typing import Optional
import numpy as np


@flojoy(node_type="TEST_TYPE")
def OPTIONALS(
    a: Optional[OrderedPair | OrderedTriple],
    b: Optional[Matrix],
    c: Optional[DataContainer],
    foo: Optional[str | int],
    bar: Optional[list[int]],
) -> OrderedPair:
    q = np.array([])
    return OrderedPair(x=q, y=q)
