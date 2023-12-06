import numpy as np
from flojoy import OrderedPair, Matrix, Scalar


def test_KAISER_BETA(mock_flojoy_decorator):
    import KAISER_BETA

    element_a = OrderedPair(x=np.ones(1), y=np.arange(1))
    res = KAISER_BETA.KAISER_BETA(default=element_a)

    # check that the outputs are one of the correct types.
    assert isinstance(res, Scalar | OrderedPair | Matrix)
