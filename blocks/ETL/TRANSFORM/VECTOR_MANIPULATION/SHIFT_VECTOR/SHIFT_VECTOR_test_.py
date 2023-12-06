from numpy import arange, array_equal, roll
from flojoy import Vector


def test_SHIFT_VECTOR(mock_flojoy_decorator):
    import SHIFT_VECTOR

    v = arange(1, 11)
    v = Vector(v=v)

    res = SHIFT_VECTOR.SHIFT_VECTOR(v, 3)

    ex = v.copy()
    assert array_equal(res.v, roll(ex.v, 3))
