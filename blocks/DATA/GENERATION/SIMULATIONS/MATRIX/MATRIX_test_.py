def test_MATRIX(mock_flojoy_decorator):
    import MATRIX

    # create the two matrices
    m1 = MATRIX.MATRIX(row=3, column=4)

    # Check if they are equal
    assert m1.m.shape == (3, 4)
