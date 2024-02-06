from flojoy import Vector, Scalar


def test_BINOM_TEST(mock_flojoy_decorator):
    import BINOM_TEST

    res = BINOM_TEST.BINOM_TEST(default=Scalar(c=10))

    # check that the outputs are one of the correct types.
    assert isinstance(res, Vector)
