import numpy as np


def test_SCALAR(mock_flojoy_decorator):
    import SCALAR

    res = SCALAR.SCALAR(value=20)
    assert np.equal(20, res.c)
