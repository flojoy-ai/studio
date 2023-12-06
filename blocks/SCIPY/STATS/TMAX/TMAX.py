from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.stats


@flojoy
def TMAX(
    default: OrderedPair | Matrix,
    upperlimit: float = 0.1,
    axis: int = 0,
    inclusive: bool = True,
    nan_policy: str = "propagate",
) -> OrderedPair | Matrix | Scalar:
    """The TMAX node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the trimmed maximum.

        This function computes the maximum value of an array along a given axis, while ignoring values larger than a specified upper limit.

    Parameters
    ----------
    a : array_like
        Array of values.
    upperlimit : None or float, optional
        Values in the input array greater than the given limit will be ignored.
        When upperlimit is None, then all values are used.
        The default value is None.
    axis : int or None, optional
        Axis along which to operate.
        Default is 0.
        If None, compute over the whole array 'a'.
    inclusive : {True, False}, optional
        This flag determines whether values exactly equal to the upper limit are included.
        The default value is True.
    nan_policy : {'propagate', 'raise', 'omit'}, optional
        Defines how to handle when input contains nan.
        The following options are available (default is 'propagate'):
        'propagate' : returns nan
        'raise' : raises an error
        'omit' : performs the calculations ignoring nan values

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.tmax(
        a=default.y,
        upperlimit=upperlimit,
        axis=axis,
        inclusive=inclusive,
        nan_policy=nan_policy,
    )

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
