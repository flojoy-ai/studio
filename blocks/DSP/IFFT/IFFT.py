from scipy import fft
from flojoy import flojoy, OrderedPair, DataFrame
import pandas as pd


@flojoy
def IFFT(default: DataFrame, real_signal: bool = True) -> OrderedPair:
    """Perform the Inverse Discrete Fourier Transform on an input signal.

    With the IFFT algorithm, the input signal will be transformed from the frequency domain back into the time domain.

    Inputs
    ------
    default : OrderedPair
        The data to apply inverse FFT to.

    Parameters
    ----------
    real_signal : boolean
        whether the input signal is real (true) or complex (false)

    Returns
    -------
    OrderedPair
        x = time
        y = reconstructed signal
    """

    dc: pd.DataFrame = default.m

    x = dc["x"].to_numpy()
    realValue = dc["real"].to_numpy()
    imagValue = dc["imag"].to_numpy()

    fourier = realValue + 1j * imagValue

    result = fft.irfft(fourier) if real_signal else fft.ifft(fourier, len(x))
    result = result.real
    return OrderedPair(x=x, y=result)
