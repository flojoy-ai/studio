from flojoy import flojoy, Matrix, Scalar
import numpy as np

import numpy.linalg


@flojoy
def EIGVALS(
    default: Matrix,
) -> Matrix | Scalar:
    """The EIGVALS node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the eigenvalues of a general matrix.

    Main difference between `eigvals` and `eig`: the eigenvectors are not returned.

    Parameters
    ----------
    a : (..., M, M) array_like
        A complex- or real-valued matrix whose eigenvalues will be computed.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.eigvals(
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
