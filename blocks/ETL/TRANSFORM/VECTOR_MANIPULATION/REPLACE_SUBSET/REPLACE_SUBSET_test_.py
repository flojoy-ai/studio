from numpy import arange, array_equal, put
from flojoy import Vector, Array
from pytest import raises


def test_REPLACE_SUBSET(mock_flojoy_decorator):
    import REPLACE_SUBSET

    v = arange(1, 11)
    v = Vector(v=v)
    ex = v.copy()

    # when only one index is specified
    res = REPLACE_SUBSET.REPLACE_SUBSET(
        v, indices=Array(ref=[0]), values=Array(ref=[22, -44, 22]), length=3
    )

    # check if the arrays are equal
    put(ex.v, [0, 1, 2], [22, -44, 22])
    assert array_equal(res.v, ex.v)

    # # # when multiple indices at different locations are specified
    res = REPLACE_SUBSET.REPLACE_SUBSET(
        v, indices=Array(ref=[1, 4, 5, 6]), values=Array(ref=[10, 100, -12, 800])
    )

    # # check if the arrays are equal
    put(ex.v, [1, 4, 5, 6], [10, 100, -12, 800])
    assert array_equal(res.v, ex.v)

    with raises(AssertionError):
        REPLACE_SUBSET.REPLACE_SUBSET(
            v, indices=Array(ref=[11]), values=Array(ref=[-11])
        )

    # when the length parameter and number of elements to replace does not match
    with raises(AssertionError):
        REPLACE_SUBSET.REPLACE_SUBSET(
            v, indices=Array(ref=[0]), values=Array(ref=[22, -44, 22]), length=5
        )
