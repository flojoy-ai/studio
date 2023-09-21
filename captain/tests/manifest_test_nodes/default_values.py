import numpy as np
from flojoy import flojoy, OrderedTriple


@flojoy(node_type="TEST_TYPE")
def DEFAULT_VALUES(
    default: OrderedTriple, foo: str = "bar", nums: list[int] = [1, 2, 3]
) -> OrderedTriple:
    a = np.array([])
    return OrderedTriple(x=a, y=a, z=a)
