from flojoy import Boolean


def test_NOT_AND(mock_flojoy_decorator):
    import NOT_AND

    x = Boolean(b=True)
    y = Boolean(b=False)

    return1 = NOT_AND.NOT_AND(x, y)
    return2 = NOT_AND.NOT_AND(x, x)
    return3 = NOT_AND.NOT_AND(y, y)

    assert return1.b is True
    assert return2.b is False
    assert return3.b is True
