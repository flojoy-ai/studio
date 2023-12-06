import cv2
from flojoy import CameraDevice, flojoy, DataContainer
from flojoy.connection_manager import DeviceConnectionManager
from typing import Optional


@flojoy(deps={"opencv-python-headless": "4.8.1.78"})
def OPEN_WEBCAM(
    camera: CameraDevice,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Open a connection with the selected camera.

    Parameters
    ----------
    camera : Camera
        The camera to use.
    resolution : select
        Camera resolution. Choose from a few options.

    Returns
    -------
    None
    """

    if not camera:
        raise ValueError("No camera selected")

    cam = cv2.VideoCapture(camera.get_id())
    DeviceConnectionManager.register_connection(camera, cam)

    return None
