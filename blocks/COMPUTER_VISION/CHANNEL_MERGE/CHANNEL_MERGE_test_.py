import numpy as np
from flojoy import Image


def test_CHANNEL_MERGE(mock_flojoy_decorator):
    import CHANNEL_MERGE

    r = 255 * np.ones((600, 600), dtype=np.uint8)
    g = 255 * np.ones((600, 600), dtype=np.uint8)
    b = 255 * np.ones((600, 600), dtype=np.uint8)
    a = np.ones((600, 600), dtype=np.uint8)

    zeros = np.zeros(r.shape, np.uint8)
    ones = 255 * np.ones(r.shape, np.uint8)

    INPUT_1 = Image(
        r=r,
        g=zeros,
        b=zeros,
        a=ones,
    )
    INPUT_2 = Image(
        r=zeros,
        g=g,
        b=zeros,
        a=ones,
    )
    INPUT_3 = Image(
        r=zeros,
        g=zeros,
        b=b,
        a=ones,
    )
    INPUT_4 = Image(
        r=zeros,
        g=zeros,
        b=zeros,
        a=a,
    )
    merged_image = CHANNEL_MERGE.CHANNEL_MERGE(
        red=INPUT_1, green=INPUT_2, blue=INPUT_3, alpha=INPUT_4
    )
    assert np.abs(merged_image.r - r).sum() < 0.1
    assert np.abs(merged_image.g - g).sum() < 0.1
    assert np.abs(merged_image.b - b).sum() < 0.1
    assert np.abs(merged_image.a - a).sum() < 0.1
