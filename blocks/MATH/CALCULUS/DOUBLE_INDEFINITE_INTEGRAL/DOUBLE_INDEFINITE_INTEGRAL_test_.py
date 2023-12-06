from flojoy import OrderedTriple
import numpy as np


def test_DOUBLE_INDEFINITE_INTEGRAL_good_output(mock_flojoy_decorator):
    import DOUBLE_INDEFINITE_INTEGRAL

    a_triple = OrderedTriple(
        x=[0, 0, 0, 0, 0, 0], y=[0, 0, 0, 0, 0, 0], z=[0, 0, 0, 0, 0, 0]
    )
    c = np.array([[0, 0, 0], [0, 0, 0]])

    output = DOUBLE_INDEFINITE_INTEGRAL.DOUBLE_INDEFINITE_INTEGRAL(a_triple, 3, 2)
    np.testing.assert_array_equal(c, output.m)


def test_DOUBLE_INDEFINITE_INTEGRAL_reshape_errorMessage(mock_flojoy_decorator):
    import DOUBLE_INDEFINITE_INTEGRAL

    a_triple = OrderedTriple(
        x=[0, 0, 0, 0, 0, 0], y=[0, 0, 0, 0, 0, 0], z=[0, 0, 0, 0, 0, 0]
    )

    np.testing.assert_raises_regex(
        ArithmeticError,
        "Cannot reshape size 6 in a matrix of 7 by 3. Please enter appropriate width and height.",
        DOUBLE_INDEFINITE_INTEGRAL.DOUBLE_INDEFINITE_INTEGRAL,
        a_triple,
        7,
        3,
    )


def test_DOUBLE_INDEFINITE_INTEGRAL_str_errorMessage(mock_flojoy_decorator):
    import DOUBLE_INDEFINITE_INTEGRAL

    b_triple = OrderedTriple(
        x=[1, 2, 3, 4], y=[0, 1, 2, 3], z=["hello", "world", "hi", "welcome"]
    )

    np.testing.assert_raises_regex(
        ValueError,
        f"The value hello in column z is of type {type('hello')}. The OrderedTriple need to contain only int or float values.",
        DOUBLE_INDEFINITE_INTEGRAL.DOUBLE_INDEFINITE_INTEGRAL,
        b_triple,
        2,
        2,
    )
