from numpy import arange, array_equal
from flojoy import Vector


def test_VECTOR_MIN(mock_flojoy_decorator):
    import VECTOR_MIN

    v = arange(10)

    v = Vector(v=v)

    res = VECTOR_MIN.VECTOR_MIN(v)
    assert array_equal(res.c, v.v[0])
