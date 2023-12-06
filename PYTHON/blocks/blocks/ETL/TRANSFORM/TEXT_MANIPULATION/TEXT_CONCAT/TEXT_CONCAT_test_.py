from flojoy import String


def test_TEXT_CONCAT(mock_flojoy_decorator):
    import TEXT_CONCAT

    a = String(s="This is to test that")
    b = String(s="text concatenation works.")

    res = TEXT_CONCAT.TEXT_CONCAT(a=a, b=b, delimiter="space")
    assert "This is to test that text concatenation works." == res.s
