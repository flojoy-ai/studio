import numpy as np
from flojoy import OrderedPair, Matrix, Scalar


def test_SAVGOL_FILTER(mock_flojoy_decorator):
    import SAVGOL_FILTER

    element_a = OrderedPair(x=np.ones(50), y=np.arange(1, 51))
    res = SAVGOL_FILTER.SAVGOL_FILTER(default=element_a)

    # check that the outputs are one of the correct types.
    assert isinstance(res, Scalar | OrderedPair | Matrix)
