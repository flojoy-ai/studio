from flojoy import flojoy, Matrix, Scalar
import numpy as np

import numpy.linalg


@flojoy
def TENSORINV(
    default: Matrix,
    ind: int = 2,
) -> Matrix | Scalar:
    """The TENSORINV node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the 'inverse' of an N-dimensional array.

        The result is an inverse for 'a' relative to the tensordot operation "tensordot(a, b, ind)",
        i.e. up to floating-point accuracy, "tensordot(tensorinv(a), a, ind)" is the "identity" tensor for the tensordot operation.

    Parameters
    ----------
    a : array_like
        Tensor to 'invert'.
        Its shape must be 'square', i.e. "prod(a.shape[:ind]) == prod(a.shape[ind:])".
    ind : int, optional
        Number of first indices that are involved in the inverse sum.
        Must be a positive integer, default is 2.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.tensorinv(
        a=default.m,
        ind=ind,
    )

    if isinstance(result, np.ndarray):
        result = Matrix(m=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
