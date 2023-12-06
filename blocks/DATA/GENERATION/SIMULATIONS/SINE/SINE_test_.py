import numpy as np
from flojoy import Vector


def test_SINE(mock_flojoy_decorator):
    import SINE

    x = np.linspace(0, 10, 1000)
    y = np.sin(x * np.pi * 2)
    res = SINE.SINE(default=Vector(v=x))

    assert np.array_equal(x, res.x)
    assert np.array_equal(y, res.y)
