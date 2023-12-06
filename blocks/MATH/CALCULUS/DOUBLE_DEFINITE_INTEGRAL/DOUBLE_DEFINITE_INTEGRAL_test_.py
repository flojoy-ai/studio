def test_DOUBLE_DEFINITE_INTEGRAL(mock_flojoy_decorator):
    import DOUBLE_DEFINITE_INTEGRAL

    function = "2*x*y"
    node = DOUBLE_DEFINITE_INTEGRAL.DOUBLE_DEFINITE_INTEGRAL(function, 1, 0, 1, 0)

    assert 0.5 == round(node.c, 1)
