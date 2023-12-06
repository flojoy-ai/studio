import numpy as np
from flojoy import OrderedPair, Matrix, Scalar


def test_GSTD(mock_flojoy_decorator):
    import GSTD

    element_a = OrderedPair(x=np.ones(50), y=np.arange(2, 52))
    res = GSTD.GSTD(default=element_a)

    # check that the outputs are one of the correct types.
    assert isinstance(res, Scalar | OrderedPair | Matrix)
