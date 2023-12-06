import numpy as np
from flojoy import flojoy, Matrix, Scalar


@flojoy
def MATRIX(row: Scalar = 100, column: Scalar = 100) -> Matrix:
    """Generates a random matrix with values between 0 and 1.

    Parameters
    ----------
    row : Scalar
        number of rows
    column : Scalar
        number of columns

    Returns
    -------
    Matrix
        Randomly generated matrix
    """

    np.random.seed()

    mat = np.random.random_sample((row, column))

    return Matrix(m=mat)
