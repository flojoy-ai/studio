import numpy as np
from flojoy import DataFrame, Matrix, OrderedPair, flojoy


@flojoy(node_type="TEST_TYPE")
def MULTIPLE_INPUTS(
    a: OrderedPair, b: list[OrderedPair], c: list[Matrix | DataFrame], foo: list[int]
) -> Matrix:
    return Matrix(np.array([]))
