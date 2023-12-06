from scipy import signal, fft
from numpy import abs
from flojoy import flojoy, OrderedPair, DataFrame
from typing import Literal
from pandas import DataFrame as df


@flojoy
def FFT(
    default: OrderedPair,
    window: Literal[
        "none",
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
    real_signal: bool = True,
    sample_rate: int = 1,
    display: bool = True,
) -> OrderedPair | DataFrame:
    """Perform a Discrete Fourier Transform on the input vector.

    Through the FFT algorithm, the input vector will be transformed from a time domain into a frequency domain, which will be an ordered pair of arrays.

    Inputs
    ------
    default : OrderedPair
        The data to apply FFT to.

    Parameters
    ----------
    window : select
        the node will apply a window to the signal to avoid spectral leakage
    real_signal : boolean
        whether the input signal is real or complex
    sample_rate : int
        the sample rate of the signal, defaults to 1
    display : boolean
        whether the output would be graphed, set to false for pure data and true for data that is more suitable to be graphed

    Returns
    -------
    OrderedPair if display is true
        x: frequency
        y: spectrum of the signal
    DataFrame if display is false
        time: time domain
        frequency: frequency domain
        real: real section of the signal
        imag: imaginary section of the signal
    """

    if sample_rate <= 0:
        raise ValueError("Sample rate must be greater than 0")

    signal_value = default.y
    x = default.x
    sample_spacing = 1.0 / sample_rate
    # x-axis
    frequency = (
        fft.rfftfreq(x.shape[-1], sample_spacing)
        if real_signal and display
        else fft.fftfreq(x.shape[-1], sample_spacing)
    )
    frequency = fft.fftshift(frequency)
    if display:
        # y-axis
        if window == "none":
            fourier = fft.rfft(signal_value) if real_signal else fft.fft(signal_value)
        else:
            window = signal.get_window(window, len(signal_value))
            fourier = (
                fft.rfft(signal_value * window)
                if real_signal
                else fft.fft(signal_value * window)
            )
        fourier = fft.fftshift(fourier)
        fourier = abs(fourier)
        return OrderedPair(x=frequency, y=fourier)

    # for processing
    fourier = fft.fft(signal_value)
    d = {"x": x, "frequency": frequency, "real": fourier.real, "imag": fourier.imag}
    return DataFrame(df=df(data=d))
