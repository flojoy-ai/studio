from numpy import array, array_equal
from flojoy import Vector


def test_VECTOR_2_MATRIX(mock_flojoy_decorator):
    import VECTOR_2_MATRIX

    x = array([1, 2, 3, 4, 5, 6])
    iVector = Vector(v=x)

    result = array([[1, 2, 3], [4, 5, 6]])

    rMatrix = VECTOR_2_MATRIX.VECTOR_2_MATRIX(iVector, 2, 3)

    assert array_equal(rMatrix.m, result)
