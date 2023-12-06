from flojoy import flojoy, Matrix, Scalar
import numpy as np

import numpy.linalg


@flojoy
def MATRIX_POWER(
    default: Matrix,
    n: int = 2,
) -> Matrix | Scalar:
    """The MATRIX_POWER node is based on a numpy or scipy function.

    The description of that function is as follows:

        Raise a square matrix to the (integer) power 'n'.

        For positive integers 'n', the power is computed by repeated matrix squarings and matrix multiplications.

        If "n == 0", the identity matrix of the same shape as M is returned. If "n < 0", the inverse is computed and then raised to "abs(n)".

    Note: Stacks of object matrices are not currently supported.

    Parameters
    ----------
    a : (..., M, M) array_like
            Matrix to be "powered".
    n : int
            The exponent can be any integer or long integer, positive, negative, or zero.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.matrix_power(
        a=default.m,
        n=n,
    )

    if isinstance(result, np.ndarray):
        result = Matrix(m=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
