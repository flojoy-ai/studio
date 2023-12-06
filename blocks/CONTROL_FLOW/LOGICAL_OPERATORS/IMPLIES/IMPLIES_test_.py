from flojoy import Boolean


def test_IMPLIES(mock_flojoy_decorator):
    import IMPLIES

    x = Boolean(b=True)
    y = Boolean(b=False)

    return1 = IMPLIES.IMPLIES(x, y)
    return2 = IMPLIES.IMPLIES(x, x)
    return3 = IMPLIES.IMPLIES(y, y)

    assert return1.b is False
    assert return2.b is True
    assert return3.b is True
