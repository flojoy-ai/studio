from flojoy import OrderedPair
import numpy as np


def test_INTEGRATE(mock_flojoy_decorator):
    import INTEGRATE

    node = INTEGRATE.INTEGRATE(OrderedPair(x=[1, 2, 3, 4, 5], y=[1, 2, 3, 4, 5]))
    result = np.trapz([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])

    assert node.y[-1] == result
