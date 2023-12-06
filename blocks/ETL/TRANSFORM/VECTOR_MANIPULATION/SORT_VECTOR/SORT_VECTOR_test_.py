import numpy as np
from flojoy import Vector


def test_SORT_MATRIX(mock_flojoy_decorator):
    import SORT_VECTOR

    x = np.array([3, 2, 1])
    inputVector = Vector(v=x)

    result = np.array([1, 2, 3])

    sortedX = SORT_VECTOR.SORT_VECTOR(inputVector)

    assert np.array_equal(sortedX.v, result)
