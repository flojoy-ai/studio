import numpy as np
from flojoy import OrderedPair, Matrix, Scalar


def test_MATRIX_POWER(mock_flojoy_decorator):
    import MATRIX_POWER

    array1 = np.eye(5)
    array2 = np.eye(9)
    array2.shape = (3, 3, 3, 3)

    try:
        element_a = Matrix(m=array1)
        res = MATRIX_POWER.MATRIX_POWER(default=element_a)
    except np.linalg.LinAlgError:
        element_a = Matrix(m=array2)
        res = MATRIX_POWER.MATRIX_POWER(default=element_a)

    # check that the outputs are one of the correct types.
    assert isinstance(res, Scalar | OrderedPair | Matrix)
