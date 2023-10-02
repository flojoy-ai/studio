from typing import Optional

import numpy as np
from flojoy import DataContainer, Matrix, OrderedPair, OrderedTriple, flojoy


@flojoy(node_type="TEST_TYPE")
def OPTIONALS(
    a: Optional[OrderedPair | OrderedTriple] = None,
    b: Optional[Matrix] = None,
    c: Optional[DataContainer] = None,
    foo: Optional[str] = None,
    bar: Optional[list[int]] = None,
) -> Optional[OrderedPair]:
    q = np.array([])
    return OrderedPair(x=q, y=q)
