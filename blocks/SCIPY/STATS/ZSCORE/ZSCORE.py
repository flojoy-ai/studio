from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.stats


@flojoy
def ZSCORE(
    default: OrderedPair | Matrix,
    axis: int = 0,
    ddof: int = 0,
    nan_policy: str = "propagate",
) -> OrderedPair | Matrix | Scalar:
    """The ZSCORE node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the z-score.

        Compute the z-score of each value in the sample, relative to the sample mean and standard deviation.

    Parameters
    ----------
    a : array_like
        An array like object containing the sample data.
    axis : int, optional
        Axis along which to operate.
        Default is 0.
        If None, compute over the whole array 'a'.
    ddof : int, optional
        Degrees of freedom correction in the calculation of the standard deviation.
        Default is 0.
    nan_policy : {'propagate', 'raise', 'omit'}, optional
        Defines how to handle when input contains nan. 'propagate' returns nan,
        'raise' throws an error, 'omit' performs the calculations ignoring nan values.
        Default is 'propagate'.
        Note that when the value is 'omit', nans in the input also propagate to the output,
        but they do not affect the z-scores computed for the non-nan values.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.zscore(
        a=default.y,
        axis=axis,
        ddof=ddof,
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
