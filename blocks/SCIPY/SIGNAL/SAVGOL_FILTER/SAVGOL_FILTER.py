from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.signal


@flojoy
def SAVGOL_FILTER(
    default: OrderedPair | Matrix,
    window_length: int = 2,
    polyorder: int = 1,
    deriv: int = 0,
    delta: float = 1.0,
    axis: int = -1,
    mode: str = "interp",
    cval: float = 0.0,
) -> OrderedPair | Matrix | Scalar:
    """The SAVGOL_FILTER node is based on a numpy or scipy function.

    The description of that function is as follows:

        Apply a Savitzky-Golay filter to an array.

        This is a 1-D filter. If 'x'  has a dimension greater than 1, 'axis' determines the axis along which the filter is applied.

    Parameters
    ----------
    x : array_like
        The data to be filtered.
        If 'x' is not a single or double precision floating point array,
        it will be converted to type numpy.float64 before filtering.
    window_length : int
        The length of the filter window (i.e., the number of coefficients).
        If 'mode' is 'interp', 'window_length' must be less than or equal to the size of 'x'.
    polyorder : int
        The order of the polynomial used to fit the samples.
        'polyorder' must be less than 'window_length'.
    deriv : int, optional
        The order of the derivative to compute.
        This must be a nonnegative integer.
        The default is 0, which means to filter the data without differentiating.
    delta : float, optional
        The spacing of the samples to which the filter will be applied.
        This is only used if deriv > 0. Default is 1.0.
    axis : int, optional
        The axis of the array 'x' along which the filter is to be applied.
        Default is -1.
    mode : str, optional
        Must be 'mirror', 'constant', 'nearest', 'wrap' or 'interp'.
        This determines the type of extension to use for the padded signal to
        which the filter is applied.
        When 'mode' is 'constant', the padding value is given by 'cval'.
        See the Notes for more details on 'mirror', 'constant', 'wrap', and 'nearest'.
        When the 'interp' mode is selected (the default), no extension is used.
        Instead, a degree 'polyorder' polynomial is fit to the last
        'window_length' values of the edges, and this polynomial is
        used to evaluate the last 'window_length // 2' output values.
    cval : scalar, optional
        Value to fill past the edges of the input if 'mode' is 'constant'.
        Default is 0.0.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.signal.savgol_filter(
        x=default.y,
        window_length=window_length,
        polyorder=polyorder,
        deriv=deriv,
        delta=delta,
        axis=axis,
        mode=mode,
        cval=cval,
    )

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
