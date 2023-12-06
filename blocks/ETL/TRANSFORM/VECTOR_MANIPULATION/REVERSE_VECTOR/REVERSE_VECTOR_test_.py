import numpy as np
from flojoy import Vector


def test_REVERSE_VECTOR(mock_flojoy_decorator):
    import REVERSE_VECTOR

    x = np.array([3, 5, 1, 6])
    inputVector = Vector(v=x)

    result = np.array([6, 1, 5, 3])

    reverseX = REVERSE_VECTOR.REVERSE_VECTOR(inputVector)

    assert np.array_equal(reverseX.v, result)
