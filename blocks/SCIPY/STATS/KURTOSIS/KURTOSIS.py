from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.stats


@flojoy
def KURTOSIS(
    default: OrderedPair | Matrix,
    axis: int = 0,
    fisher: bool = True,
    bias: bool = True,
    nan_policy: str = "propagate",
    keepdims: bool = False,
) -> OrderedPair | Matrix | Scalar:
    """The KURTOSIS node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the kurtosis (Fisher or Pearson) of a dataset.

        Kurtosis is the fourth central moment divided by the square of the variance.
        If Fisher's definition is used, then 3.0 is subtracted from the result to give 0.0 for a normal distribution.

        If bias is False then the kurtosis is calculated using k statistics to eliminate bias coming from biased moment estimators

        Use `kurtosistest` to see if result is close enough to normal.

    Parameters
    ----------
    a : array
        Data for which the kurtosis is calculated.
    axis : int or None, default: 0
        If an int, the axis of the input along which to compute the statistic.
        The statistic of each axis-slice (e.g. row) of the input will appear in a
        corresponding element of the output.
        If None, the input will be raveled before computing the statistic.
    fisher : bool, optional
        If True, Fisher's definition is used (normal ==> 0.0).
        If False, Pearson's definition is used (normal ==> 3.0).
    bias : bool, optional
        If False, then the calculations are corrected for statistical bias.
    nan_policy : {'propagate', 'omit', 'raise'}
        Defines how to handle input NaNs.
        - propagate : if a NaN is present in the axis slice (e.g. row) along
        which the  statistic is computed, the corresponding entry of the output will be NaN.
        - omit : NaNs will be omitted when performing the calculation.
        If insufficient data remains in the axis slice along which the
        statistic is computed, the corresponding entry of the output will be NaN.
        - raise : if a NaN is present, a ValueError will be raised.
    keepdims : bool, default: False
        If this is set to True, the axes which are reduced are left
        in the result as dimensions with size one. With this option,
        the result will broadcast correctly against the input array.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.kurtosis(
        a=default.y,
        axis=axis,
        fisher=fisher,
        bias=bias,
        nan_policy=nan_policy,
        keepdims=keepdims,
    )

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
