import numpy as np
from flojoy import Vector


def test_INTERLEAVE_VECTOR(mock_flojoy_decorator):
    import INTERLEAVE_VECTOR

    x = np.array([1, 2, 3, 4, 5, 6])
    y = np.array([9, 8, 7, 6, 5, 4])
    z = np.array([4, 3, 2, 1, 8, 7])

    inputX = Vector(v=x)
    inputY = Vector(v=y)
    inputZ = Vector(v=z)

    result = np.array([1, 9, 4, 2, 8, 3, 3, 7, 2, 4, 6, 1, 5, 5, 8, 6, 4, 7])

    interleaveVector = INTERLEAVE_VECTOR.INTERLEAVE_VECTOR(inputX, [inputY, inputZ])
    print(interleaveVector.v)
    assert np.array_equal(interleaveVector.v, result)
