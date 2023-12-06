from numpy import arange, array_equal, delete
from flojoy import Vector, Array
from pytest import raises


def test_VECTOR_DELETE(mock_flojoy_decorator):
    import VECTOR_DELETE

    v = arange(1, 11)
    v_len = len(v)
    v = Vector(v=v)
    ex = v.copy()

    # when only one index is specified

    res = VECTOR_DELETE.VECTOR_DELETE(v, indices=Array(ref=[0]), length=3)
    assert array_equal(len(res.v), v_len - 3)

    # check if the arrays are equal
    tmp = delete(ex.v, [0, 1, 2], None)
    assert array_equal(res.v, tmp)

    # # when multiple indices at different locations are specified
    res = VECTOR_DELETE.VECTOR_DELETE(v, indices=Array(ref=[1, 4, 5, 6]))
    assert array_equal(len(res.v), v_len - 4)

    # check if the arrays are equal
    tmp = delete(ex.v, [1, 4, 5, 6], None)
    assert array_equal(res.v, tmp)

    with raises(AssertionError):
        VECTOR_DELETE.VECTOR_DELETE(v, indices=Array(ref=[11]))
