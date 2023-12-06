from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import scipy.signal


@flojoy
def WELCH(
    default: OrderedPair | Matrix,
    fs: float = 1.0,
    window: str = "hann",
    nperseg: int = 2,
    noverlap: int = 1,
    nfft: int = 2,
    detrend: str = "constant",
    return_onesided: bool = True,
    scaling: str = "density",
    axis: int = -1,
    average: str = "mean",
    select_return: Literal["f", "Pxx"] = "f",
) -> OrderedPair | Matrix | Scalar:
    """The WELCH node is based on a numpy or scipy function.

    The description of that function is as follows:

            Estimate power spectral density using Welch's method.

            Welch's method [1]_ computes an estimate of the power spectral density by dividing the data into overlapping segments,
            computing a modified periodogram for each segment, and averaging the periodograms.

    Parameters
    ----------
    select_return : 'f', 'Pxx'
        Select the desired object to return.
        See the respective function docs for descriptors.
    x : array_like
        Time series of measurement values.
    fs : float, optional
        Sampling frequency of the 'x' time series.
        Defaults to 1.0.
    window : str or tuple or array_like, optional
        Desired window to use. If 'window' is a string or tuple, it is
        passed to 'get_window' to generate the window values, which are
        DFT-even by default.
        See 'get_window' for a list of windows and required parameters.
        If 'window' is array_like,it will be used directly as the window
        and its length must be nperseg.
        Defaults to a Hann window.
    nperseg : int, optional
        Length of each segment.
        Defaults to None, but if window is str or tuple, is set to 256,
        and if window is array_like, is set to the length of the window.
    noverlap : int, optional
        Number of points to overlap between segments.
        If 'None', noverlap = nperseg // 2.
        Defaults to 'None'.
    nfft : int, optional
        Length of the FFT used, if a zero padded FFT is desired.
        If 'None', the FFT length is 'nperseg'.
        Defaults to 'None'.
    detrend : str or function or 'False', optional
        Specifies how to detrend each segment.
        If 'detrend' is a string, it is passed as the 'type' argument to the 'detrend' function.
        If it is a function, it takes a segment and returns a detrended segment.
        If 'detrend' is 'False', no detrending is done.
        Defaults to 'constant'.
    return_onesided : bool, optional
        If 'True', returns a one-sided spectrum for real data.
        If 'False', returns a two-sided spectrum.
        Defaults to 'True', but for complex data, a two-sided spectrum is always returned.
    scaling : { 'density', 'spectrum' }, optional
        Selects between computing the power spectral density ('density')
        where 'Pxx' has units of V**2/Hz and computing the power
        spectrum ('spectrum') where 'Pxx' has units of V**2, if 'x'
        is measured in V and 'fs' is measured in Hz.
        Defaults to 'density'.
    axis : int, optional
        Axis along which the periodogram is computed.
        The default is over the last axis (i.e. axis=-1).
    average : { 'mean', 'median' }, optional
        Method to use when averaging periodograms.
        Defaults to 'mean'.

    .. versionadded:: 1.2.0

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.signal.welch(
        x=default.y,
        fs=fs,
        window=window,
        nperseg=nperseg,
        noverlap=noverlap,
        nfft=nfft,
        detrend=detrend,
        return_onesided=return_onesided,
        scaling=scaling,
        axis=axis,
        average=average,
    )

    return_list = ["f", "Pxx"]
    if isinstance(result, tuple):
        res_dict = {}
        num = min(len(result), len(return_list))
        for i in range(num):
            res_dict[return_list[i]] = result[i]
        result = res_dict[select_return]
    else:
        result = result._asdict()
        result = result[select_return]

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
