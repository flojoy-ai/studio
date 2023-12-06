import numpy as np
from flojoy import Matrix


def test_MATMUL(mock_flojoy_decorator):
    import MATMUL

    x = np.eye(3)
    x[2, 0] = 1

    element = Matrix(m=x)
    res = MATMUL.MATMUL(a=element, b=element)

    assert np.array_equal(res.m, np.matmul(x, x))
