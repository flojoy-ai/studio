from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.signal


@flojoy
def HILBERT(
    default: OrderedPair | Matrix,
    N: int = 2,
    axis: int = -1,
) -> OrderedPair | Matrix | Scalar:
    """The HILBERT node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the analytic signal, using the Hilbert transform.

        The transformation is done along the last axis by default.

    Parameters
    ----------
    x : array_like
        Signal data.  Must be real.
    N : int, optional
        Number of Fourier components. Default: x.shape[axis].
    axis : int, optional
        Axis along which to do the transformation. Default: -1.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.signal.hilbert(
        x=default.y,
        N=N,
        axis=axis,
    )

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
