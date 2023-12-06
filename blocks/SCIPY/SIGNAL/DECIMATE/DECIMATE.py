from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.signal


@flojoy
def DECIMATE(
    default: OrderedPair | Matrix,
    q: int = 2,
    n: int = 2,
    ftype: str = "iir",
    axis: int = -1,
    zero_phase: bool = True,
) -> OrderedPair | Matrix | Scalar:
    """The DECIMATE node is based on a numpy or scipy function.

    The description of that function is as follows:

        Downsample the signal after applying an anti-aliasing filter.

        By default, an order 8 Chebyshev type I filter is used. A 30 point FIR filter with Hamming window is used if `ftype` is 'fir'.

    Parameters
    ----------
    x : array_like
        The signal to be downsampled, as an N-dimensional array.
    q : int
        The downsampling factor. When using IIR downsampling, it is recommended
        to call `decimate` multiple times for downsampling factors higher than 13.
    n : int, optional
        The order of the filter (1 less than the length for 'fir').
        Defaults to 8 for 'iir' and 20 times the downsampling factor for 'fir'.
    ftype : str {'iir', 'fir'} or "dlti" instance, optional
        If 'iir' or 'fir', specifies the type of lowpass filter.
        If an instance of an "dlti" object, uses that object to filter before downsampling.
    axis : int, optional
        The axis along which to decimate.
    zero_phase : bool, optional
        Prevent phase shift by filtering with 'filtfilt' instead of 'lfilter'
        when using an IIR filter, and shifting the outputs back by the filter's
        group delay when using an FIR filter. The default value of 'True' is
        recommended, since a phase shift is generally not desired.

    .. versionadded:: 0.18.0

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.signal.decimate(
        x=default.y,
        q=q,
        n=n,
        ftype=ftype,
        axis=axis,
        zero_phase=zero_phase,
    )

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
