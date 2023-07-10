from flojoy import flojoy, DataContainer, OrderedPair, OrderedTriple, Matrix
from typing import Optional
import numpy as np


@flojoy(node_type="TEST_TYPE")
def OPTIONALS(
    a: Optional[OrderedPair | OrderedTriple] = None,
    b: Optional[Matrix] = None,
    c: Optional[DataContainer] = None,
    foo: Optional[str] = None,
    bar: Optional[list[int]] = None,
) -> OrderedPair:
    q = np.array([])
    return OrderedPair(x=q, y=q)
