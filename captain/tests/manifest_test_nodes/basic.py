import numpy as np
from flojoy import flojoy, OrderedPair, DataContainer


@flojoy(node_type="TEST_TYPE")
def BASIC(default: OrderedPair, other: DataContainer, some_param: int) -> OrderedPair:
    return OrderedPair(x=np.array([]), y=np.array([]))
