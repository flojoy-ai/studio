from urllib.parse import urlparse

from flojoy import flojoy, Image, DataFrame, Grayscale, String
from typing import Literal, Optional
import numpy as np
from PIL import Image as PIL_Image
import pandas as pd

import requests
from io import BytesIO


def get_file_url(url: str):
    parse_result = urlparse(url)
    if not all([parse_result.scheme, parse_result.netloc]):
        raise ValueError(f"'{url}' is not a valid URL.")
    return url


# TODO: Consolidate remote files (S3, HTTP, etc...) and perhaps even merge REMOTE_FILE AND LOCAL_FILE in a single node.
@flojoy(
    deps={
        "xlrd": "2.0.1",
        "lxml": "4.9.2",
        "openpyxl": "3.0.10",
        "scikit-image": "0.21.0",
    }
)
def REMOTE_FILE(
    file_url: str = None,
    default: Optional[String] = None,
    file_type: Literal["Image", "Grayscale", "JSON", "CSV", "Excel", "XML"] = "Image",
) -> Image | DataFrame:
    """Load a remote file from an HTTP URL endpoint, infer the type, and convert it to a DataContainer class.

    Note: If both the file_url and default are not specified when file_type="Image", a default image will be loaded.

    For now, REMOTE_FILE only supports HTTP file URLs, in particular GCP URL (starting with gcp://). S3 URL (starting with s3://) and other bucket-like URLs are not supported.

    If the file url is not specified and the default input is not connected, or if the file url is not a valid URL, a ValueError is raised.

    Parameters
    ----------
    file_url : str
        URL of the file to be loaded.
    default : Optional[String]
        If this input node is connected, the file URL will be taken from
        the output of the connected node.
        To be used in conjunction with batch processing.
    file_type : str
        Type of file to load, default = image.

    Returns
    -------
    Image|DataFrame
        Image for file_type 'image'.
        DataFrame for file_type 'json', 'csv', 'excel', 'xml'.
    """

    file_url = default.s if default else file_url
    file_url = "" if file_url is None else file_url

    match file_type:
        case "Image":
            file_url = get_file_url(file_url)
            response = requests.get(file_url)
            f = PIL_Image.open(BytesIO(response.content))
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

            file_url = get_file_url(file_url)
            return Grayscale(img=skimage.io.imread(file_url, as_gray=True))
        case "CSV":
            file_url = get_file_url(file_url)
            df = pd.read_csv(file_url)
            return DataFrame(df=df)
        case "JSON":
            file_url = get_file_url(file_url)
            df = pd.read_json(file_url)
            return DataFrame(df=df)
        case "XML":
            file_url = get_file_url(file_url)
            df = pd.read_xml(file_url)
            return DataFrame(df=df)
        case "Excel":
            file_url = get_file_url(file_url)
            df = pd.read_excel(file_url)
            return DataFrame(df=df)
