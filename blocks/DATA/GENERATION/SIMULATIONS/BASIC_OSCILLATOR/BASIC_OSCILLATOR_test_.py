import numpy as np


def test_BASIC_OSCILLATOR(mock_flojoy_decorator):
    import BASIC_OSCILLATOR

    x = np.linspace(0, 10, 1000)
    y = np.sin(x * np.pi * 2)
    res = BASIC_OSCILLATOR.BASIC_OSCILLATOR()

    assert np.array_equal(x, res.x)
    assert np.array_equal(y, res.y)
