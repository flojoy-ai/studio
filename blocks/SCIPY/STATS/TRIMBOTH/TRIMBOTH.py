from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.stats


@flojoy
def TRIMBOTH(
    default: OrderedPair | Matrix,
    proportiontocut: float = 0.1,
    axis: int = 0,
) -> OrderedPair | Matrix | Scalar:
    """The TRIMBOTH node is based on a numpy or scipy function.

    The description of that function is as follows:

        Slice off a proportion of items from both ends of an array.

        Slice off the passed proportion of items from both ends of the passed array
        (i.e., with 'proportiontocut' = 0.1, slices leftmost 10% and rightmost 10% of scores).
        The trimmed values are the lowest and highest ones.
        Slice off less if proportion results in a non-integer slice index (i.e. conservatively slices off 'proportiontocut').

    Parameters
    ----------
    a : array_like
        Data to trim.
    proportiontocut : float
        Proportion (in range 0-1) of total data set to trim of each end.
    axis : int or None, optional
        Axis along which to trim data.
        Default is 0.
        If None, compute over the whole array 'a'.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.trimboth(
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
