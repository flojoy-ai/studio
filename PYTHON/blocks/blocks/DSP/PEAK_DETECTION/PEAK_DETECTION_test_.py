import numpy as np
from flojoy import OrderedPair


def test_SAVGOL(mock_flojoy_decorator):
    import SAVGOL

    x = np.linspace(0.0, 10.0, 1000)
    y = np.sin(2.0 * np.pi * x)

    # Sine should be between -1 and 1.
    assert np.max(y) > 0.9 and np.min(y) < -0.9

    element = OrderedPair(x=x, y=y)
    res = SAVGOL.SAVGOL(element)

    # Savgol sine should be smoothed with lower values (~0.6).
    assert np.max(res.y) < 0.7 and np.min(res.y) > -0.7
