from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.stats


@flojoy
def TRIM_MEAN(
    default: OrderedPair | Matrix,
    proportiontocut: float = 0.1,
    axis: int = 0,
) -> OrderedPair | Matrix | Scalar:
    """The TRIM_MEAN node is based on a numpy or scipy function.

    The description of that function is as follows:

        Return the mean of an array after trimming distribution from both tails.

        If `proportiontocut` = 0.1, slices off 'leftmost' and 'rightmost' 10% of scores.
        The input is sorted before slicing.
        Slices off less if proportion results in a non-integer slice index (i.e. conservatively slices off 'proportiontocut').

    Parameters
    ----------
    a : array_like
        Input array.
    proportiontocut : float
        Fraction to cut off of both tails of the distribution.
    axis : int, optional
        Axis along which the trimmed means are computed.
        Default is 0.
        If None, compute over the whole array 'a'.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.trim_mean(
        a=default.y,
        proportiontocut=proportiontocut,
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
