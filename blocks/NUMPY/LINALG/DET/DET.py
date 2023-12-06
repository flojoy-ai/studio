from flojoy import flojoy, Matrix, Scalar
import numpy as np

import numpy.linalg


@flojoy
def DET(
    default: Matrix,
) -> Matrix | Scalar:
    """The DET node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the determinant of an array.

    Parameters
    ----------
    a : (..., M, M) array_like
        Input array to compute determinants.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.det(
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
