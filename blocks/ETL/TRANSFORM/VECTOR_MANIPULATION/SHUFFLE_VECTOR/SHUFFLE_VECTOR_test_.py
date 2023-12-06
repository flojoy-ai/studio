import numpy as np
from flojoy import Vector


def test_SHUFFLE_VECTOR(mock_flojoy_decorator):
    import SHUFFLE_VECTOR

    np.random.seed(42)

    x = np.array([3, 5, 1, 6])

    inputVector = Vector(v=x)

    result = np.random.permutation(x)

    np.random.seed(42)

    shuffledX = SHUFFLE_VECTOR.SHUFFLE_VECTOR(inputVector)

    assert np.array_equal(shuffledX.v, result)
