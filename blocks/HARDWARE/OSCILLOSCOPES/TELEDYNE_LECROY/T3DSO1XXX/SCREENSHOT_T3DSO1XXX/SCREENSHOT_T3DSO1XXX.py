from flojoy import flojoy, DataContainer, VisaConnection, Image
from typing import Optional
from PIL import Image as PIL_Image
import numpy as np
import io


@flojoy(inject_connection=True)
def SCREENSHOT_T3DSO1XXX(
    connection: VisaConnection,
    default: Optional[DataContainer] = None,
) -> Image:
    """Get an image of the screen from an T3DSO1000(A)-2000 oscilloscope.

    Dump the screen of the T3DSO to an Image that can be display or saved.

    Requires a CONNECT_T3DSO1XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should work with any Teledyne LeCroy T3DSO1000(A)-2000 series oscilloscope.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECT_T3DSO1XXX block).

    Returns
    -------
    Image
        The image of the screen of the T3DSO1000(A)-2000 oscilloscope.
    """

    scope = connection.get_handle()

    scope.write("SCDP")
    raw_str = scope.read_raw()

    # Convert the raw bytes to an image
    image = PIL_Image.open(io.BytesIO(raw_str))
    img_array = np.array(image.convert("RGBA"))
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
