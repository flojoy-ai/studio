from flojoy import flojoy, Matrix, Scalar
import numpy as np

import numpy.linalg


@flojoy
def INV(
    default: Matrix,
) -> Matrix | Scalar:
    """The INV node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the (multiplicative) inverse of a matrix.

        Given a square matrix 'a', return the matrix 'ainv', satisfying "dot(a, ainv) = dot(ainv, a) = eye(a.shape[0])".

    Parameters
    ----------
    a : (..., M, M) array_like
        Matrix to be inverted.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.inv(
        a=default.m,
    )

    if isinstance(result, np.ndarray):
        result = Matrix(m=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
