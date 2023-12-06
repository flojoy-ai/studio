from flojoy import flojoy, Matrix, Scalar
import numpy as np

import numpy.linalg


@flojoy
def PINV(
    default: Matrix,
    rcond: float = 1e-15,
    hermitian: bool = False,
) -> Matrix | Scalar:
    """The PINV node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the (Moore-Penrose) pseudo-inverse of a matrix.

        Calculate the generalized inverse of a matrix using its singular-value decomposition (SVD) and including all **large** singular values.

    .. versionchanged:: 1.14
        Can now operate on stacks of matrices

    Parameters
    ----------
    a : (..., M, N) array_like
        Matrix or stack of matrices to be pseudo-inverted.
    rcond : (...) array_like of float
        Cutoff for small singular values.
        Singular values less than or equal to "rcond * largest_singular_value" are set to zero.
        Broadcasts against the stack of matrices.
    hermitian : bool, optional
        If True, "a" is assumed to be Hermitian (symmetric if real-valued), enabling a more
        efficient method for finding singular values.
        Defaults to False.

    .. versionadded:: 1.17.0

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.pinv(
        a=default.m,
        rcond=rcond,
        hermitian=hermitian,
    )

    if isinstance(result, np.ndarray):
        result = Matrix(m=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
