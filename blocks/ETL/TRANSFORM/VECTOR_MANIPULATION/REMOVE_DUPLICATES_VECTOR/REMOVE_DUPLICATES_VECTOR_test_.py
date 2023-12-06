import numpy as np
from flojoy import Vector


def test_REMOVE_DUPLICATES_VECTOR(mock_flojoy_decorator):
    import REMOVE_DUPLICATES_VECTOR

    x = np.array([3, 5, 5, 6, 6, 1])
    inputVector = Vector(v=x)

    result = np.array([1, 3, 5, 6])

    removeDuplicatesX = REMOVE_DUPLICATES_VECTOR.REMOVE_DUPLICATES_VECTOR(inputVector)

    assert np.array_equal(removeDuplicatesX.v, result)
