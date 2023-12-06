import numpy as np
from flojoy import Image, flojoy
from skimage.transform import swirl


@flojoy(deps={"scikit-image": "0.21.0"})
def IMAGE_SWIRL(
    default: Image,
    rotation: float = 0,
    strength: float = 10,
    radius: float = 120,
) -> Image:
    """
    Adjusts the gamma of an input image and outputs the adjusted image

    Parameters
    ----------
    default: Image
        The input image
    gain: float, default=1
        The gain of the logarithmic correction.
    gamma: float, default=1
        The gamma to correct to.

    Returns
    -------
    Image
        The adjusted image.
    """

    r = default.r
    g = default.g
    b = default.b
    a = default.a

    if a is not None:
        rgba_image = np.stack((r, g, b, a), axis=2)
    else:
        rgba_image = np.stack((r, g, b), axis=2)

    corrected_image = swirl(
        rgba_image,
        rotation=rotation,
        strength=strength,
        radius=radius,
    )

    r = corrected_image[:, :, 0]
    g = corrected_image[:, :, 1]
    b = corrected_image[:, :, 2]
    if a is not None:
        a = corrected_image[:, :, 3]

    return Image(r=r, g=g, b=b, a=a)
