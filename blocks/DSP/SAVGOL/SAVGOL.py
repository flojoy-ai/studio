import scipy
from flojoy import flojoy, OrderedPair
import warnings


@flojoy
def SAVGOL(
    default: OrderedPair, window_length: int = 50, poly_order: int = 1
) -> OrderedPair:
    """Apply a Savitzky-Golay filter to an input signal. This is generally used for smoothing data.

    The default behaviour is to implement a 3-point moving average of the data.

    Inputs
    ------
    default : OrderedPair
        The data to apply the numpy savgol filter to.

    Parameters
    ----------
    window_length : int
        the length of the filter window, must be less than or equal to the size of the input
    poly_order : int
        the order of the polynomial used to fit the samples, must be less than or equal to the size of window_length

    Returns
    -------
    OrderedPair
        x: time axis
        y: filtered signal
    """

    signal = default.y
    if window_length >= len(default.y):
        warnings.warn(
            "Polynomial order is greater than the window size. Using p=w-1..."
        )
        poly_order = len(default.y) - 1

    if poly_order >= window_length:
        warnings.warn(
            "Polynomial order is greater than the window size. Using p=w-1..."
        )
        poly_order = window_length - 1

    filtered = scipy.signal.savgol_filter(signal, window_length, poly_order)
    return OrderedPair(x=default.x, y=filtered)
