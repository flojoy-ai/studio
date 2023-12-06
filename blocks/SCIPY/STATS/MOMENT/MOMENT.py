from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.stats


@flojoy
def MOMENT(
    default: OrderedPair | Matrix,
    moment: int = 1,
    axis: int = 0,
    nan_policy: str = "propagate",
    keepdims: bool = False,
) -> OrderedPair | Matrix | Scalar:
    """The MOMENT node is based on a numpy or scipy function.

    The description of that function is as follows:

        Calculate the nth moment about the mean for a sample.

        A moment is a specific quantitative measure of the shape of a set of points.
        It is often used to calculate coefficients of skewness and kurtosis due to its close relationship with them.

    Parameters
    ----------
    a : array_like
        Input array.
    moment : int or array_like of ints, optional
        Order of central moment that is returned.
        Default is 1.
    axis : int or None, default: 0
        If an int, the axis of the input along which to compute the statistic.
        The statistic of each axis-slice (e.g. row) of the input will appear in a
        corresponding element of the output.
        If None, the input will be raveled before computing the statistic.
    nan_policy : {'propagate', 'omit', 'raise'}
        Defines how to handle input NaNs.
        - propagate : if a NaN is present in the axis slice (e.g. row) along
        which the statistic is computed, the corresponding entry of the output will be NaN.
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

    result = scipy.stats.moment(
        a=default.y,
        moment=moment,
        axis=axis,
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
