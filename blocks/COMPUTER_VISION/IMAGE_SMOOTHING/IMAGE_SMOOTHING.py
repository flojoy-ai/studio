from typing import Literal

import cv2
import numpy as np
from flojoy import Image, flojoy


@flojoy(deps={"opencv-python-headless": "4.8.1.78"})
def IMAGE_SMOOTHING(
    default: Image,
    kernel: int = 5,
    smoothing_type: Literal["average", "gaussian", "median", "bilateral"] = "average",
) -> Image:
    """Apply an image smoothing operation on an input image.

    Note: For "gaussian" and "median" type, you are only allowed an odd number for the kernel value.

    See https://docs.opencv.org/4.x/d4/d13/tutorial_py_filtering.html for smoothing function information.

    Inputs
    ------
    default : Image
        The input image to apply smoothing to.

    Parameters
    ----------
    kernel : int
        The strength of the smoothing (larger = stronger smoothing).
    smoothing_type : select
        The type of smoothing function to use.

    Returns
    -------
    Image
        The smoothed image.
    """

    r = default.r
    g = default.g
    b = default.b
    a = default.a

    if a is not None:
        rgba_image = np.stack((r, g, b, a), axis=2)
    else:
        rgba_image = np.stack((r, g, b), axis=2)

    try:
        match smoothing_type:
            case "average":
                image = cv2.blur(rgba_image, (kernel, kernel))
            case "gaussian":
                assert kernel & 1, "Kernel must be odd for 'gaussian' smoothing."
                image = cv2.GaussianBlur(rgba_image, (kernel, kernel), 0)
            case "median":
                assert kernel & 1, "Kernel must be odd for 'median' smoothing."
                image = cv2.medianBlur(rgba_image, kernel)
            case "bilateral":
                rgba_image = cv2.cvtColor(rgba_image, cv2.COLOR_BGRA2BGR)
                image = cv2.bilateralFilter(rgba_image, kernel, kernel * 5, kernel * 5)
        try:
            r, g, b, a = cv2.split(image)
        except Exception:
            r, g, b = cv2.split(image)
        if a is None:
            a = None
        return Image(
            r=r,
            g=g,
            b=b,
            a=a,
        )
    except Exception as e:
        raise e
