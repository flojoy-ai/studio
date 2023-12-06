import numpy as np
from flojoy import Image


def test_CHANNEL_SPLIT(mock_flojoy_decorator):
    import CHANNEL_SPLIT

    red = 255 * np.ones((600, 600), dtype=np.uint8)
    green = 255 * np.ones((600, 600), dtype=np.uint8)
    blue = 255 * np.ones((600, 600), dtype=np.uint8)
    alpha = np.ones((600, 600), dtype=np.uint8)

    input = Image(r=red, g=green, b=blue, a=alpha)
    res = CHANNEL_SPLIT.CHANNEL_SPLIT(input)
    r = res["r"].r
    g = res["g"].g
    b = res["b"].b
    a = res["a"].a

    # Assert returns image channels are matching the input channel
    assert np.abs(red - r).sum() < 1e-1
    assert np.abs(green - g).sum() < 1e-1
    assert np.abs(blue - b).sum() < 1e-1
    assert np.abs(alpha - a).sum() < 1e-1
