import numpy as np
from flojoy import Vector


def test_VECTOR_LENGTH(mock_flojoy_decorator):
    import VECTOR_LENGTH

    x = np.ones(5)

    element = Vector(v=x)
    res = VECTOR_LENGTH.VECTOR_LENGTH(element)

    assert np.array_equal(res.c, 5)
