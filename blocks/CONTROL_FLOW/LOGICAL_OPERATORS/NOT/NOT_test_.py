from flojoy import Boolean


def test_NOT(mock_flojoy_decorator):
    import NOT

    x = Boolean(b=True)
    y = Boolean(b=False)

    return1 = NOT.NOT(x)
    return2 = NOT.NOT(y)

    assert return1.b is False
    assert return2.b is True
