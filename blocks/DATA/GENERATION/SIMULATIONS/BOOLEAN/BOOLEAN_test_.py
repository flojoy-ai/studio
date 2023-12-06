def test_BOOLEAN(mock_flojoy_decorator):
    import BOOLEAN

    test1 = BOOLEAN.BOOLEAN(True)
    test2 = BOOLEAN.BOOLEAN(False)

    assert test1.b is True
    assert test2.b is False
