from typing import Optional
from flojoy import VisaConnection, flojoy, Image, DataContainer, Directory
from numpy import array
from time import sleep
from PIL import Image as im
from os import path


@flojoy(inject_connection=True)
def SCREENSHOT_MSO2X(
    connection: VisaConnection,
    local_file_path: Directory,
    input: Optional[DataContainer] = None,
    path_on_scope: str = "C:\\screenshots\\screenshot.png",
    filename: str = "screenshot.png",
    auto_index: bool = False,
) -> Image:
    """Save a screenshot from a Tektronix MSO oscilloscope.

    Saves a screenshot locally (on the PC) and on the scope.
    Also outputs the image to Flojoy.

    Note the directory chosen on the scope must already exist.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24. Should be compatible with many Tektronix MSO
    series oscilloscopes.

    Input blocks - any (most)
    Output blocks - IMAGE, COMPUTER_VISION blocks

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    local_file_path: Directory
        Choose a file where the image will be saved locally.
    path_on_scope: str, default = "C:\\screenshots\\screenshot.png"
        The file name and path on the scope
    filename_pc: str
        The file name of the screenshot saved locally.
    auto_index: bool
        Adds '_XXX' to end of file name and increases that index automatically.

    Returns
    -------
    Image
        The screenshot
    """

    # Local/PC file name definition
    file_pc = str(path.join(local_file_path.unwrap(), filename))
    if auto_index:
        i = 0
        check = file_pc[:-4] + "_" + str(i).zfill(3) + ".png"
        while path.exists(check):
            i += 1
            check = file_pc[:-4] + "_" + str(i).zfill(3) + ".png"
        file_pc = check

    # Retrieve oscilloscope instrument connection.
    scope = connection.get_handle()

    # Save the image on the scope.
    scope.commands.save.image.write(path_on_scope)

    # Adding delay for saving the image on the scope.
    sleep(1)

    # Read and transfer the screenshot to pc
    scope.commands.filesystem.readfile.write(path_on_scope)
    imageData = scope.read_raw()

    # Save screenshot locally
    with open(file_pc, "wb") as f:
        f.write(imageData)

    # Convert screenshot and output image to Flojoy canvas
    imageData = array(im.open(file_pc).convert("RGBA"))
    r = imageData[:, :, 0]
    g = imageData[:, :, 1]
    b = imageData[:, :, 2]
    a = imageData[:, :, 3]

    return Image(r=r, g=g, b=b, a=a)
