import os
import pytest

import PIL.Image
import numpy as np

from flojoy import Image


@pytest.fixture
def obama_image_array_rgb():
    _image_path = f"{os.path.dirname(os.path.realpath(__file__))}/assets/President_Barack_Obama.jpg"
    image = PIL.Image.open(_image_path).convert("RGB")
    return np.array(image)


@pytest.mark.slow
def test_OPEN_IMAGE(mock_flojoy_decorator, obama_image_array_rgb):
    import OPEN_IMAGE

    _image_path = f"{os.path.dirname(os.path.realpath(__file__))}/assets/President_Barack_Obama.jpg"

    output = OPEN_IMAGE.OPEN_IMAGE(_image_path)

    input_img = Image(
        r=obama_image_array_rgb[:, :, 0],
        g=obama_image_array_rgb[:, :, 1],
        b=obama_image_array_rgb[:, :, 2],
        a=None,
    )

    np.testing.assert_array_equal(output.r, input_img.r)
    np.testing.assert_array_equal(output.g, input_img.g)
    np.testing.assert_array_equal(output.b, input_img.b)
    np.testing.assert_array_equal(output.a, input_img.a)
