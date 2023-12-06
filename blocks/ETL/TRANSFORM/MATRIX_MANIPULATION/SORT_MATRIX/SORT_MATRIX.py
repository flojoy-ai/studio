from numpy import sort
from flojoy import flojoy, Matrix


@flojoy
def SORT_MATRIX(a: Matrix, axis: int = -1) -> Matrix:
    """Take an input matrix and sort it along the chosen axis.

    Inputs
    ------
    a : Matrix
        The input matrix to be multiplied to input b

    Parameters
    ----------
    axis : int
        Axis along which to sort. Default is -1, which means sort along the last axis.

    Returns
    -------
    Matrix
        The matrix result from sorting.
    """
    inputMatrix = a.m
    sortedMatrix = sort(inputMatrix, axis=axis)

    return Matrix(m=sortedMatrix)
