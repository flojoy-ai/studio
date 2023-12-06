import numpy as np
from flojoy import Matrix


def test_TRANSPOSE_MATRIX(mock_flojoy_decorator):
    import TRANSPOSE_MATRIX

    x = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    iMatrix = Matrix(m=x)

    result = np.array([[1, 4, 7], [2, 5, 8], [3, 6, 9]])

    rMatrix = TRANSPOSE_MATRIX.TRANSPOSE_MATRIX(iMatrix)

    assert np.array_equal(rMatrix.m, result)
