import numpy as np
import cv2
from PIL import ImageFilter, Image as PILImage
from flojoy import Image


def test_EDGE_DETECTION(mock_flojoy_decorator):
    import EDGE_DETECTION

    x = np.eye(5).astype("uint8") * 255
    rgba_image = np.stack((x, x, x, x), axis=2)
    image = PILImage.fromarray(rgba_image)
    image = image.convert("L").filter(ImageFilter.FIND_EDGES).convert("RGB")
    image = np.array(image)
    r, g, b = cv2.split(image)

    element = Image(r=x, g=x, b=x, a=x)
    res = EDGE_DETECTION.EDGE_DETECTION(element)

    assert np.array_equal(res.r, r)
    assert np.array_equal(res.g, g)
    assert np.array_equal(res.b, b)
