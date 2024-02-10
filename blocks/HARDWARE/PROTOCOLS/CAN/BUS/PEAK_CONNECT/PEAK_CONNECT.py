from flojoy import flojoy, DataContainer, DeviceConnectionManager, HardwareDevice
from typing import Optional
import can


@flojoy(deps={"python-can": "4.3.1", "uptime": "3.0.1"})
def PEAK_CONNECT(
    PCAN_address: str, bitrate: int = 500000, default: Optional[DataContainer] = None
) -> Optional[DataContainer]:
    """Connect to a PCAN device.

    Connect to a PCAN device. This blocks should be compatible with all devices that support the PCAN interface.

    For Windows and Linux compatibilities, the following Drviers are required:
        → https://www.peak-system.com/Drivers.523.0.html?&L=1
    For MacOS compatibilities, the following Drivers are required:
        → https://mac-can.github.io/

    Parameters
    ----------
    PCAN_address : str
        The PCAN device address to connect to. This address can be found by the PCAN_DETECT_AVAILABLE_DEVICES block.
        → Example: "PCAN_USBBUS1"
    bitrate : int
        The bitrate of the PCAN device. Default is 500000.

    Returns
    -------
    DataContainer
        Optional: None
    """

    session = can.interface.Bus(interface="pcan", channel=PCAN_address, bitrate=bitrate)

    DeviceConnectionManager.register_connection(HardwareDevice(PCAN_address), session, cleanup = lambda pcan_bus: pcan_bus.shutdown())

    return None
