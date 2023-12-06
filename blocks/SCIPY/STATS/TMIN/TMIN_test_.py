import numpy as np
from flojoy import OrderedPair, Matrix, Scalar


def test_TMIN(mock_flojoy_decorator):
    import TMIN

    element_a = OrderedPair(x=np.ones(50), y=np.arange(1, 51))
    res = TMIN.TMIN(default=element_a)

    # check that the outputs are one of the correct types.
    assert isinstance(res, Scalar | OrderedPair | Matrix)
