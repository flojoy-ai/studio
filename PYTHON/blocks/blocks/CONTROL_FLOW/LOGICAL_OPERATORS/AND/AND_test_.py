from flojoy import Boolean


def test_AND(mock_flojoy_decorator):
    import AND

    x = Boolean(b=True)
    y = Boolean(b=False)

    return1 = AND.AND(x, y)
    return2 = AND.AND(x, x)
    return3 = AND.AND(y, y)

    assert return1.b is False
    assert return2.b is True
    assert return3.b is False
