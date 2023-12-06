import numpy as np
from flojoy import OrderedPair, Matrix, Scalar


def test_BINOM_TEST(mock_flojoy_decorator):
    import BINOM_TEST

    element_a = OrderedPair(x=np.ones(1), y=np.arange(1))
    res = BINOM_TEST.BINOM_TEST(default=element_a)

    # check that the outputs are one of the correct types.
    assert isinstance(res, Scalar | OrderedPair | Matrix)
