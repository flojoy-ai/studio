from os import path

from flojoy import File, Image, flojoy
from matplotlib import image
from numpy import asarray


@flojoy
def OPEN_IMAGE(file_path: File | None = None) -> Image:
    """Load an image file from disk and return a DataContainer of type 'image'.

    Inputs
    ------
    default: None

    Parameters
    ----------
    file_path : File
        path to the file to be loaded

    Returns
    -------
    Image
        Image loaded from specified file path
    """

    if not path.exists(file_path):
        raise ValueError("File path does not exist!")
    read_image = image.imread(file_path)
    data = asarray(read_image)

    red_channel = data[:, :, 0]
    green_channel = data[:, :, 1]
    blue_channel = data[:, :, 2]

    if data.shape[2] == 4:
        alpha_channel = data[:, :, 3]
    else:
        alpha_channel = None

    return Image(
        r=red_channel,
        g=green_channel,
        b=blue_channel,
        a=alpha_channel,
    )
