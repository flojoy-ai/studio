import numpy as np
from flojoy import Vector


def test_CONSTANT_fills_with_value(mock_flojoy_decorator):
    # node under test
    import CONSTANT

    res = CONSTANT.CONSTANT(default=None, constant=2.0)
    assert np.all(res.y == 2.0)


def test_CONSTANT_takes_x_as_input(mock_flojoy_decorator):
    # node under test
    import CONSTANT

    x = Vector(v=np.arange(0, 99, 2))
    res = CONSTANT.CONSTANT(default=x, constant=2.0)
    np.testing.assert_allclose(res.x, x.v)
