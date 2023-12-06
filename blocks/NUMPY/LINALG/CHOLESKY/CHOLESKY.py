from flojoy import flojoy, Matrix, Scalar
import numpy as np

import numpy.linalg


@flojoy
def CHOLESKY(
    default: Matrix,
) -> Matrix | Scalar:
    """The CHOLESKY node is based on a numpy or scipy function.

    The description of that function is as follows:

        Cholesky decomposition.

        Return the Cholesky decomposition, "L * L.H", of the square matrix "a", where "L" is lower-triangular and .H is the conjugate transpose operator (which is the ordinary transpose if "a" is real-valued).

        "a" must be Hermitian (symmetric if real-valued) and positive-definite. No checking is performed to verify whether "a" is Hermitian or not.

        In addition, only the lower-triangular and diagonal elements of "a" are used. Only "L" is actually returned.

    Parameters
    ----------
    a : (..., M, M) array_like
        Hermitian (symmetric if all elements are real), positive-definite input matrix.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.cholesky(
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
