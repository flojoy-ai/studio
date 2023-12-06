import numpy as np
import cv2
from flojoy import Image


def test_IMAGE_SMOOTHING(mock_flojoy_decorator):
    import IMAGE_SMOOTHING

    x = np.eye(3)

    rgba_image = np.stack((x, x, x, x), axis=2)
    image = cv2.blur(rgba_image, (5, 5))

    element = Image(r=x, g=x, b=x, a=x)
    res = IMAGE_SMOOTHING.IMAGE_SMOOTHING(element)

    assert np.array_equal(res.r, image[:, :, 0])
    assert np.array_equal(res.g, image[:, :, 1])
    assert np.array_equal(res.b, image[:, :, 2])
    assert np.array_equal(res.a, image[:, :, 3])
