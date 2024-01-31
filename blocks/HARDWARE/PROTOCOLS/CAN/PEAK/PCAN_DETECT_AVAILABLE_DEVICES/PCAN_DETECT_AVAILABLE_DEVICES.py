from flojoy import flojoy, String, DataContainer
import can
from typing import Optional


@flojoy(deps={"python-can": "4.3.1", "uptime": "3.0.1"})
def PCAN_DETECT_AVAILABLE_DEVICES(default: Optional[DataContainer]) -> String:
    """Detects available PCAN devices and returns a string containing the device name and the channel number.

    This blocks is use to detect available PCAN devices and returns a string containing the device name and the channel number.
    → Use the channel number to configure to connect to PEAK can hardware and other devices that support the PCAN interface using the PCAN_CONNECT block.

    For Windows and Linux compatibilities, the following Drviers are required:
        → https://www.peak-system.com/Drivers.523.0.html?&L=1
    For MacOS compatibilities, the following Drivers are required:
        → https://mac-can.github.io/

    Parameters
    ----------
    None

    Returns
    -------
    String
        A string containing the device name and the channel number.
    """
    available_channels = can.detect_available_configs("pcan")

    str_builder = ""
    for channel in available_channels:
        str_builder += f"{channel['device_name']}: {channel['channel']}\n"

    if str_builder == "":
        raise Exception(
            "No device available detected. Please make sure that the PCAN drivers are installed."
        )

    return String(str_builder)
