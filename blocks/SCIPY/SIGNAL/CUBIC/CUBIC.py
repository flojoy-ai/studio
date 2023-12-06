from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.signal


@flojoy
def CUBIC(
    default: OrderedPair | Matrix,
) -> OrderedPair | Matrix | Scalar:
    """The CUBIC node is based on a numpy or scipy function.

    The description of that function is as follows:

        A cubic B-spline.
        This is a special case of 'bspline', and equivalent to "bspline(x, 3)".

    Parameters
    ----------
    x : array_like
        a knot vector

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.signal.cubic(
        x=default.y,
    )

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
