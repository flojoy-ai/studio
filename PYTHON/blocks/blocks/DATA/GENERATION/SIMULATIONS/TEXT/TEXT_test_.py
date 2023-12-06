def test_TEXT(mock_flojoy_decorator):
    import TEXT

    res = TEXT.TEXT(value="Hello World!")
    assert "Hello World!" == res.text_blob
