import numpy as np
from flojoy import OrderedPair


def test_VECTOR_2_ORDERED_PAIR(mock_flojoy_decorator):
    import ORDERED_PAIR_XY_INVERT

    x = np.linspace(2.0, 3.0, num=5)
    y = np.linspace(5.0, 7.0, num=5)

    generatedOP = ORDERED_PAIR_XY_INVERT.ORDERED_PAIR_XY_INVERT(OrderedPair(x=x, y=y))

    np.testing.assert_array_equal(generatedOP.x, y)
    np.testing.assert_array_equal(generatedOP.y, x)
