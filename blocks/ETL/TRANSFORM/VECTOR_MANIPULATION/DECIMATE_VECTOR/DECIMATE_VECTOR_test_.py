import numpy as np
from flojoy import Vector


def test_DECIMATE_VECTOR(mock_flojoy_decorator):
    import DECIMATE_VECTOR

    x = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9])
    inputVector = Vector(v=x)

    result = np.array([1, 3, 5, 7, 9])

    decimateX = DECIMATE_VECTOR.DECIMATE_VECTOR(inputVector, 2)
    print(decimateX)

    assert np.array_equal(decimateX.v, result)
