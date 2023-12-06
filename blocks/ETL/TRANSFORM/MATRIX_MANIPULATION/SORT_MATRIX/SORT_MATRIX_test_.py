import numpy as np
from flojoy import Matrix


def test_SORT_MATRIX(mock_flojoy_decorator):
    import SORT_MATRIX

    x = np.array([[3, 2, 1], [6, 5, 4], [9, 8, 7]])
    inputMatrix = Matrix(m=x)

    result = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

    sortedX = SORT_MATRIX.SORT_MATRIX(inputMatrix, 1)

    assert np.array_equal(sortedX.m, result)
