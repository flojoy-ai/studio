import numpy as np
from scipy import fft
from flojoy import OrderedPair


def test_FFT(mock_flojoy_decorator):
    import FFT

    N = 600
    T = 1.0 / 800.0
    x = np.linspace(0.0, N * T, N, endpoint=False)
    y = np.sin(50.0 * 2.0 * np.pi * x) + 0.5 * np.sin(80.0 * 2.0 * np.pi * x)
    element = OrderedPair(x=x, y=y)
    res = FFT.FFT(
        default=element,
        window="none",
        real_signal=False,
        sample_rate=800.0,
        display=True,
    )  # type: ignore

    yf = fft.fft(y)
    yf = np.abs(fft.fftshift(yf))
    xf = fft.fftfreq(N, T)
    xf = fft.fftshift(xf)

    assert (yf == res.y).all()
    assert (xf == res.x).all()
