import numpy as np
from scipy import fft
import pandas as pd

from flojoy import DataFrame


def test_IFFT(mock_flojoy_decorator):
    import IFFT

    N = 600
    T = 1.0 / 800.0
    x = np.linspace(0.0, N * T, N, endpoint=False)
    y = np.sin(50.0 * 2.0 * np.pi * x) + 0.5 * np.sin(80.0 * 2.0 * np.pi * x)
    fourier = fft.fft(y)

    d = {"x": x, "real": fourier.real, "imag": fourier.imag}
    element = DataFrame(df=pd.DataFrame(data=d))
    res = IFFT.IFFT(default=element, real_signal=False)

    original = fft.ifft(fourier).real
    assert (x == res.x).all()
    assert (original == res.y).all()
