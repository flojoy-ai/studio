import numpy as np
from scipy import fft

from flojoy import Matrix


def test_2DFFT(mock_flojoy_decorator):
    import TWO_DIMENSIONAL_FFT

    m = np.mgrid[:5, :5][0]
    element = Matrix(m=m)

    res = TWO_DIMENSIONAL_FFT.TWO_DIMENSIONAL_FFT(
        default=element, real_signal=False, color="red"
    )
    expected = fft.fft2(m).real
    assert (expected == res.m).all()
