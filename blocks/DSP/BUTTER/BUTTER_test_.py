import numpy as np
from flojoy import OrderedPair


def test_BUTTER(mock_flojoy_decorator):
    import BUTTER

    x = np.linspace(0.0, 10.0, 1000)
    y = np.sin(2.0 * np.pi * x) + 1

    # Sine mean should be between -1 and 1.
    assert np.mean(y) > 0.9 and np.mean(y) < 1.1

    element = OrderedPair(x=x, y=y)
    res = BUTTER.BUTTER(
        element, filter_order=1, critical_frequency=12, btype="highpass", sample_rate=25
    )

    # Butter'ed sine mean should be close to zero.
    assert np.isclose(np.mean(res.y), 0, atol=0.01)
