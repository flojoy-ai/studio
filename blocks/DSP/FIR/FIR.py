from scipy import signal
from flojoy import flojoy, OrderedPair
from typing import Literal


@flojoy
def FIR(
    default: OrderedPair,
    sample_rate: int = 100,
    filter_type: Literal["lowpass", "highpass", "bandpass", "bandstop"] = "lowpass",
    window: Literal[
        "boxcar",
        "triang",
        "blackman",
        "hamming",
        "hann",
        "bartlett",
        "flattop",
        "parzen",
        "bohman",
        "blackmanharris",
        "nuttall",
        "barthann",
        "cosine",
        "exponential",
        "tukey",
        "taylor",
        "lanczos",
    ] = "hann",
    cutoff_low: float = 10.0,
    cutoff_high: float = 15.0,
    taps: int = 200,
) -> OrderedPair:
    """Apply a low-pass FIR filter to an input vector. The filter is designed with the window method.

    This filter takes a few inputs: the sample_rate (will be passed as a parameter if the target node is not connected), the window type of the filter, the cutoff frequency, and the number of taps (or length) of the filter.

    Inputs
    ------
    default : OrderedPair
        The data to apply a FIR filter to.

    Parameters
    ----------
    sample_rate : int
        the amount of samples within a second
    filter_type : select
        how the filter behaves
    window : select
        the window function used in the FIR
    cutoff_low : float
        the frequency cutoff to filter out the lower frequencies
    cutoff_high : float
        the frequency cutoff to filter out the upper frequencies
    taps : int
        the length of the filter

    Returns
    -------
    OrderedPair
        x: time domain
        y: filtered signal
    """

    sample_rate: int = sample_rate  # Hz
    filter_type: str = filter_type
    window_type: str = window
    cutoff_low: float = cutoff_low
    cutoff_high: float = cutoff_high
    n_taps: int = taps
    times = default.x
    input_signal = default.y

    if input_signal.size < n_taps * 3:
        raise ValueError("length of the data should be three times longer than taps")
    elif (
        n_taps % 2 == 0
    ):  # in the case where the passband contains the Nyquist frequency
        n_taps = n_taps + 1

    # create the filter with the parameter inputs
    if filter_type == "bandpass" or filter_type == "bandstop":
        fil = signal.firwin(
            numtaps=n_taps,
            cutoff=[cutoff_low, cutoff_high],
            fs=sample_rate,
            pass_zero=filter_type,
            window=window_type,
        )
    elif filter_type == "lowpass":
        fil = signal.firwin(
            numtaps=n_taps,
            cutoff=cutoff_high,
            fs=sample_rate,
            pass_zero=filter_type,
            window=window_type,
        )
    else:
        fil = signal.firwin(
            numtaps=n_taps,
            cutoff=cutoff_low,
            fs=sample_rate,
            pass_zero=filter_type,
            window=window_type,
        )

    # ... and then apply it to the signal
    filtered_x = signal.filtfilt(fil, 1.0, input_signal)
    return OrderedPair(x=times, y=filtered_x)
