import numpy as np
from flojoy import Matrix


def test_INVERT(mock_flojoy_decorator):
    import INVERT

    x = np.eye(3)
    x[2, 0] = 1

    element = Matrix(m=x)
    res = INVERT.INVERT(element)

    print(x.T, res.m)

    assert np.array_equal(res.m, np.linalg.inv(x))
