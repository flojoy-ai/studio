from numpy import ones, array_equal
from flojoy import Vector
from pytest import raises


def test_VECTOR_INSERT(mock_flojoy_decorator):
    import VECTOR_INSERT

    v = ones(10)
    v_len = len(v)

    v = Vector(v=v)
    res = VECTOR_INSERT.VECTOR_INSERT(v, index=0, value=8)
    assert array_equal(len(res.v), v_len + 1)
    assert array_equal(res.v[0], 8)

    res = VECTOR_INSERT.VECTOR_INSERT(v, index=9, value=10)
    assert array_equal(res.v[-1], 10)

    with raises(AssertionError):
        VECTOR_INSERT.VECTOR_INSERT(v, index=10)
