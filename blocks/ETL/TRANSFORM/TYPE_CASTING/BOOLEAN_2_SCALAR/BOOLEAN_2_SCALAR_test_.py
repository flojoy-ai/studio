from flojoy import Boolean


def test_BOOLEAN_2_SCALAR(mock_flojoy_decorator):
    import BOOLEAN_2_SCALAR

    x = Boolean(b=True)
    y = Boolean(b=False)

    xReturn = BOOLEAN_2_SCALAR.BOOLEAN_2_SCALAR(x)
    yReturn = BOOLEAN_2_SCALAR.BOOLEAN_2_SCALAR(y)

    assert xReturn.c == 1
    assert yReturn.c == 0
