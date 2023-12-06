import cv2
from flojoy import flojoy, DataContainer, CameraConnection, Image
from typing import Optional, Literal


@flojoy(deps={"opencv-python-headless": "4.8.1.78"}, inject_connection=True)
def WEBCAM(
    connection: CameraConnection,
    default: Optional[DataContainer] = None,
    resolution: Literal[
        "default", "640x360", "640x480", "1280x720", "1920x1080"
    ] = "default",
) -> Image:
    """Acquire an image using the selected camera.

    The selected camera must be opened already using the OPEN_WEBCAM block.

    Parameters
    ----------
    connection : Camera
        The opened camera connection to use.
    resolution : select
        Camera resolution. Choose from a few options.

    Returns
    -------
    Image
    """
    cam = connection.get_handle()

    try:
        if resolution != "default":
            resolution = resolution.split("x")
            try:
                cam.set(cv2.CAP_PROP_FRAME_WIDTH, int(resolution[0]))
                cam.set(cv2.CAP_PROP_FRAME_HEIGHT, int(resolution[1]))
            except cv2.error as camera_error:
                print(f"Invalid resolution ({resolution}). Try a lower value.")
                raise camera_error

        if not cam.isOpened():
            raise cv2.error("Failed to open camera")

        result, BGR_img = cam.read()

        if not result:
            raise cv2.error("Failed to capture image")
        # cam.release()
        # del cam

        RGB_img = cv2.cvtColor(BGR_img, cv2.COLOR_BGR2RGB)

        # Split the image channels
        red_channel = RGB_img[:, :, 0]
        green_channel = RGB_img[:, :, 1]
        blue_channel = RGB_img[:, :, 2]

        if RGB_img.shape[2] == 4:
            alpha_channel = RGB_img[:, :, 3]
        else:
            alpha_channel = None

        camera_image = Image(
            r=red_channel,
            g=green_channel,
            b=blue_channel,
            a=alpha_channel,
        )

        return camera_image

    except cv2.error as camera_error:
        raise camera_error
