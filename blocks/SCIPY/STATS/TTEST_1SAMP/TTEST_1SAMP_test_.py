import numpy as np
from flojoy import OrderedPair, Matrix, Scalar


def test_TTEST_1SAMP(mock_flojoy_decorator):
    import TTEST_1SAMP

    element_a = OrderedPair(x=np.ones(50), y=np.arange(1, 51))
    res = TTEST_1SAMP.TTEST_1SAMP(default=element_a)

    # check that the outputs are one of the correct types.
    assert isinstance(res, Scalar | OrderedPair | Matrix)
