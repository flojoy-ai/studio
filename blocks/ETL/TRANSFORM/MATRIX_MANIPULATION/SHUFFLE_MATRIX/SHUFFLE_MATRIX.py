from numpy.random import permutation
from flojoy import flojoy, Matrix


@flojoy
def SHUFFLE_MATRIX(
    default: Matrix,
    axis: int = 0,
) -> Matrix:
    """Return a matrix that is randomly shuffled by the first axis

    Inputs
    ------
    default : Matrix
        The input Matrix

    Parameters
    ----------
    axis : int
        Axis along the matrix is shuffled. If axis is 0, shuffled by row and if it is 1, shuffled by column.

    Returns
    -------
    Matrix
        Shuffled input Matrix
    """

    if axis == 1:
        indices_1 = permutation(default.m.shape[0])
        shuffledMatrix = default.m[indices_1, :]
    elif axis == 0:
        indices_2 = permutation(default.m.shape[1])
        shuffledMatrix = default.m[:, indices_2]
    else:
        raise AssertionError(f"Axis must be either 0 or 1, but provided {axis}")

    return Matrix(m=shuffledMatrix)
