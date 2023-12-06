import numpy as np
import scipy.signal
from flojoy import Matrix, OrderedPair, Scalar, flojoy


@flojoy
def BSPLINE(
    default: OrderedPair | Matrix,
    n: int = 2,
) -> OrderedPair | Matrix | Scalar:
    """The BSPLINE node is based on a numpy or scipy function.

    The description of that function is as follows:

        B-spline basis function of order n.

    Parameters
    ----------
    x : array_like
        A knot vector.
    n : int
        The order of the spline. Must be non-negative, i.e. n >= 0.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.signal.bspline(
        x=default.y,
        n=n,
    )

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
