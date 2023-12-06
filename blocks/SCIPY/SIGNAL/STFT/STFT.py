from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import scipy.signal


@flojoy
def STFT(
    default: OrderedPair | Matrix,
    fs: float = 1.0,
    window: str = "hann",
    nperseg: int = 2,
    noverlap: int = 1,
    nfft: int = 2,
    detrend: bool = False,
    return_onesided: bool = True,
    boundary: str = "zeros",
    padded: bool = True,
    axis: int = -1,
    scaling: str = "spectrum",
    select_return: Literal["f", "t", "Zxx"] = "f",
) -> OrderedPair | Matrix | Scalar:
    """The STFT node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the Short Time Fourier Transform (STFT).

        STFTs can be used as a way of quantifying the change of a nonstationary signal's frequency and phase content over time.

    Parameters
    ----------
    select_return : 'f', 't', 'Zxx'
        Select the desired object to return.
        See the respective function docs for descriptors.
    x : array_like
        Time series of measurement values.
    fs : float, optional
        Sampling frequency of the 'x' time series.
        Defaults to 1.0.
    window : str or tuple or array_like, optional
        Desired window to use.
        If 'window' is a string or tuple, it is passed to 'get_window'
        to generate the window values, which are DFT-even by default.
        See 'get_window' for a list of windows and required parameters.
        If 'window' is array_like it will be used directly as the window
        and its length must be nperseg.
        Defaults to a Hann window.
    nperseg : int, optional
        Length of each segment.
        Defaults to 256.
    noverlap : int, optional
        Number of points to overlap between segments.
        If 'None', noverlap = nperseg // 2.
        Defaults to 'None'.
        When specified, the COLA constraint must be met (see Notes below).
    nfft : int, optional
        Length of the FFT used, if a zero padded FFT is desired.
        If 'None', the FFT length is 'nperseg'.
        Defaults to 'None'.
    detrend : str or function or 'False', optional
        Specifies how to detrend each segment.
        If 'detrend' is a string, it is passed as the 'type' argument to the 'detrend' function.
        If it is a function, it takes a segment and returns a detrended segment.
        If 'detrend' is 'False', no detrending is done.
        Defaults to 'False'.
    return_onesided : bool, optional
        If 'True', return a one-sided spectrum for real data.
        If 'False' return a two-sided spectrum.
        Defaults to 'True', but for complex data, a two-sided spectrum is always returned.
    boundary : str or None, optional
        Specifies whether the input signal is extended at both ends, and
        how to generate the new values, in order to center the first
        windowed segment on the first input point.
        This has the benefit of enabling reconstruction of the first input point
        when the employed window function starts at zero.
        Valid options are ['even', 'odd', 'constant', 'zeros', None].
        Defaults to 'zeros', for zero padding extension.
        I.e. [1, 2, 3, 4] is extended to [0, 1, 2, 3, 4, 0] for nperseg=3.
    padded : bool, optional
        Specifies whether the input signal is zero-padded at the end to
        make the signal fit exactly into an integer number of window
        segments, so that all of the signal is included in the output.
        Defaults to 'True'.
        Padding occurs after boundary extension, if 'boundary' is not 'None',
        and 'padded' is 'True', as is the default.
    axis : int, optional
        Axis along which the STFT is computed.
        The default is over the last axis (i.e. axis=-1).
    scaling: {'spectrum', 'psd'}
        The default 'spectrum' scaling allows each frequency line of 'Zxx' to
        be interpreted as a magnitude spectrum.
        The 'psd' option scales each line to a power spectral density.
        It allows to calculate the signal's energy by numerically integrating over abs(Zxx)**2.

    .. versionadded:: 1.9.0

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.signal.stft(
        x=default.y,
        fs=fs,
        window=window,
        nperseg=nperseg,
        noverlap=noverlap,
        nfft=nfft,
        detrend=detrend,
        return_onesided=return_onesided,
        boundary=boundary,
        padded=padded,
        axis=axis,
        scaling=scaling,
    )

    return_list = ["f", "t", "Zxx"]
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
