import os
from typing import Literal, Optional

import numpy as np
import pandas as pd
from flojoy import DataFrame, Grayscale, Image, TextBlob, flojoy
from PIL import Image as PIL_Image


def get_file_path(file_path: str, default_path: str | None = None):
    # TODO: We should not do this, this is too fragile
    # We need to get an actual file picker going to get the absolute path

    f_path = file_path if file_path != "" else default_path
    if not f_path:
        raise ValueError(
            "The file path of the input file is missing. "
            "Please provide a input TextBlob or a provide `file_path` with a value!"
        )
    if not os.path.isabs(f_path):
        path_to_nodes = __file__[: __file__.rfind("blocks") + 6]
        return os.path.abspath(os.path.join(path_to_nodes, f_path))
    return f_path


@flojoy(
    deps={
        "scikit-image": "0.21.0",
    }
)
def LOCAL_FILE(
    file_path: str | None = None,
    default: Optional[TextBlob] = None,
    file_type: Literal["Image", "Grayscale", "JSON", "CSV"] = "Image",
) -> Image | DataFrame | Grayscale:
    """The LOCAL_FILE node loads a local file of a different type and converts it to a DataContainer class.

    Parameters
    ----------
    file_path : str
        The path to the file to be loaded. This can be either an absolute path or
        a path relative to the "nodes" directory.

    default : Optional[TextBlob]
        If this input node is connected, the file name will be taken from
        the output of the connected node.
        To be used in conjunction with batch processing.
    file_type : str
        Type of file to load, default = image.
        If both 'file_path' and 'default' are not specified when 'file_type="Image"',
        a default image will be loaded.
        If the file path is not specified and the default input is not connected,
        a ValueError is raised.

    Returns
    -------
    Image | DataFrame
        Image for file_type 'image'.
        Grayscale from file_type 'Grayscale'.
        DataFrame for file_type 'json', 'csv'.
    """

    default_image_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "assets",
        "astronaut.png",
    )

    file_path = default.text_blob if default else file_path
    file_path = "" if file_path is None else file_path

    match file_type:
        case "Image":
            file_path = get_file_path(file_path, default_image_path)
            f = PIL_Image.open(file_path)
            img_array = np.array(f.convert("RGBA"))
            red_channel = img_array[:, :, 0]
            green_channel = img_array[:, :, 1]
            blue_channel = img_array[:, :, 2]
            if img_array.shape[2] == 4:
                alpha_channel = img_array[:, :, 3]
            else:
                alpha_channel = None
            return Image(
                r=red_channel,
                g=green_channel,
                b=blue_channel,
                a=alpha_channel,
            )
        case "Grayscale":
            import skimage.io

            file_path = get_file_path(file_path, default_image_path)
            return Grayscale(img=skimage.io.imread(file_path, as_gray=True))
        case "CSV":
            file_path = get_file_path(file_path)
            df = pd.read_csv(file_path)
            return DataFrame(df=df)
        case "JSON":
            file_path = get_file_path(file_path)
            df = pd.read_json(file_path)
            return DataFrame(df=df)
        # TODO: we might add support for following file types later
        # case "XML":
        #     file_path = get_file_path(file_path)
        #     df = pd.read_xml(file_path)
        #     return DataFrame(df=df)
        # case "Excel":
        #     file_path = get_file_path(file_path)
        #     df = pd.read_excel(file_path)
        #     return DataFrame(df=df)
