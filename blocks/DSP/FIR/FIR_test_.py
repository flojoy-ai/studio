import numpy as np
from scipy import fft
from flojoy import OrderedPair


def test_FIR(mock_flojoy_decorator):
    import FIR

    N = 1000
    T = 1.0 / 100.0
    x = np.linspace(0.0, T * N, N, endpoint=False)
    y = 2 * np.sin(2.0 * np.pi * x * 10) + np.sin(2.0 * np.pi * x * 20)

    yf = fft.rfft(y)
    yf = np.abs(fft.fftshift(yf))
    xf = fft.rfftfreq(N, T)
    xf = fft.fftshift(xf)

    # Highest point of the FFT will be 10 Hz.
    assert xf[np.argmax(yf)] == 10.0

    element = OrderedPair(x=x, y=y)
    res = FIR.FIR(element, sample_rate=1 / T, filter_type="highpass", cutoff_high=15)

    yf = fft.rfft(res.y)
    yf = np.abs(fft.fftshift(yf))
    xf = fft.rfftfreq(N, T)
    xf = fft.fftshift(xf)

    # Applying a highpass will remove the 10 Hz signal.
    assert xf[np.argmax(yf)] == 20.0
