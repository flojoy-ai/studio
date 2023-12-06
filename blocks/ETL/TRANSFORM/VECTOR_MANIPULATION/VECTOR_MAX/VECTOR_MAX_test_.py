from numpy import arange, array_equal
from flojoy import Vector


def test_VECTOR_MAX(mock_flojoy_decorator):
    import VECTOR_MAX

    v = arange(10)

    v = Vector(v=v)

    res = VECTOR_MAX.VECTOR_MAX(v)
    assert array_equal(res.c, v.v[-1])
