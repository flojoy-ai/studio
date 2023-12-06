from flojoy import OrderedPair
import numpy as np


def test_DIFFERENTIATE(mock_flojoy_decorator):
    import DIFFERENTIATE

    x = np.array([1, 2, 3, 5, 10])
    y = np.array([4, 6, 7, 9, 5])

    element = OrderedPair(x=x, y=y)
    output = DIFFERENTIATE.DIFFERENTIATE(element)
    assert isinstance(output, OrderedPair)
    # since output was differentiated once, there should be one less row
    assert output.y.shape == (len(output.x) - 1,)
