from flojoy import TextBlob


def test_TEXT_CONCAT(mock_flojoy_decorator):
    import TEXT_CONCAT

    a = TextBlob(text_blob="This is to test that")
    b = TextBlob(text_blob="text concatenation works.")

    res = TEXT_CONCAT.TEXT_CONCAT(a=a, b=b, delimiter="space")
    assert "This is to test that text concatenation works." == res.text_blob
