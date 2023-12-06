from flojoy import Boolean


def test_EXCLUSIVE_OR(mock_flojoy_decorator):
    import EXCLUSIVE_OR

    x = Boolean(b=True)
    y = Boolean(b=False)

    return1 = EXCLUSIVE_OR.EXCLUSIVE_OR(x, y)
    return2 = EXCLUSIVE_OR.EXCLUSIVE_OR(x, x)
    return3 = EXCLUSIVE_OR.EXCLUSIVE_OR(y, y)

    assert return1.b is True
    assert return2.b is False
    assert return3.b is False
