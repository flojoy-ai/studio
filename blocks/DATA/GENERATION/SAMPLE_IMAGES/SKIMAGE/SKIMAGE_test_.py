from skimage import data
from flojoy import Image


# Tests that the function returns the expected 'astronaut' image in DataContainer Image class when called without the 'img_key' parameter
def test_default_img_key(mock_flojoy_decorator):
    import SKIMAGE

    astronaut_img = getattr(data, "astronaut")()

    expected_image = Image(
        r=astronaut_img[:, :, 0],
        g=astronaut_img[:, :, 1],
        b=astronaut_img[:, :, 2],
        a=None,
    )
    actual_image = SKIMAGE.SKIMAGE()
    assert actual_image.r.shape == expected_image.r.shape
    assert actual_image.g.shape == expected_image.g.shape
    assert actual_image.b.shape == expected_image.b.shape
    assert actual_image.a is None


# Tests that the function returns the expected "camera" image when called with the 'camera' image_key parameter
def test_camera_img_key(mock_flojoy_decorator):
    import SKIMAGE

    camera_img = getattr(data, "camera")()
    r = g = b = camera_img
    expected_image = Image(r=r, g=g, b=b, a=None)
    actual_image = SKIMAGE.SKIMAGE()
    assert actual_image.r.shape == expected_image.r.shape
    assert actual_image.g.shape == expected_image.g.shape
    assert actual_image.b.shape == expected_image.b.shape
    assert actual_image.a is None
