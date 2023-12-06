import numpy as np


def test_LINSPACE(mock_flojoy_decorator):
    import LINSPACE

    x = np.linspace(0, 10, 1000)
    res = LINSPACE.LINSPACE(start=0, end=10, step=1000)

    assert np.array_equal(x, res.v)
