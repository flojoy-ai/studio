from numpy import array, array_equal
from flojoy import Matrix


def test_MATRIX_2_VECTOR(mock_flojoy_decorator):
    import MATRIX_2_VECTOR

    x = array([[1, 2], [3, 4], [5, 6], [7, 8], [9, 0]])
    iMatrix = Matrix(m=x)

    result = array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])

    rVector = MATRIX_2_VECTOR.MATRIX_2_VECTOR(iMatrix)

    assert array_equal(rVector.v, result)
