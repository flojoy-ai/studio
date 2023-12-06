from numpy import arange, array_equal, take
from flojoy import Vector, Array
from pytest import raises


def test_VECTOR_SUBSET(mock_flojoy_decorator):
    import VECTOR_SUBSET

    v = arange(1, 11)
    v = Vector(v=v)
    ex = v.copy()

    # when only one index is specified
    res = VECTOR_SUBSET.VECTOR_SUBSET(v, indices=Array(ref=[0]), length=3)

    # check if the arrays are equal
    tmp = take(ex.v, [0, 1, 2])
    assert array_equal(len(tmp), len(res.v))
    assert array_equal(res.v, tmp)

    # # # when multiple indices at different locations are specified
    res = VECTOR_SUBSET.VECTOR_SUBSET(v, indices=Array(ref=[1, 4, 5, 6]))

    # # check if the arrays are equal
    tmp = take(ex.v, [1, 4, 5, 6])
    assert array_equal(len(tmp), len(res.v))
    assert array_equal(res.v, tmp)

    with raises(AssertionError):
        VECTOR_SUBSET.VECTOR_SUBSET(v, indices=Array(ref=[11]))
