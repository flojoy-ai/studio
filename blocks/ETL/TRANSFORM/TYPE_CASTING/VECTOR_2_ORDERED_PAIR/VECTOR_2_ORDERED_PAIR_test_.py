import numpy as np
from flojoy import Vector


def test_VECTOR_2_ORDERED_PAIR(mock_flojoy_decorator):
    import VECTOR_2_ORDERED_PAIR

    x = np.linspace(2.0, 3.0, num=5)
    y = np.linspace(5.0, 7.0, num=5)

    generatedOP = VECTOR_2_ORDERED_PAIR.VECTOR_2_ORDERED_PAIR(
        default=Vector(x), y=Vector(y)
    )

    np.testing.assert_array_equal(generatedOP.x, x)
    np.testing.assert_array_equal(generatedOP.y, y)
