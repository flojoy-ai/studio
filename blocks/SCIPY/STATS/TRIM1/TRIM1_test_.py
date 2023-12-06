import numpy as np
from flojoy import OrderedPair, Matrix, Scalar


def test_TRIM1(mock_flojoy_decorator):
    import TRIM1

    element_a = OrderedPair(x=np.ones(50), y=np.arange(1, 51))
    res = TRIM1.TRIM1(default=element_a)

    # check that the outputs are one of the correct types.
    assert isinstance(res, Scalar | OrderedPair | Matrix)
