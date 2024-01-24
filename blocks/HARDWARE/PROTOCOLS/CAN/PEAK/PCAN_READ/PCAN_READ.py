from flojoy import flojoy, DataContainer, DeviceConnectionManager, Stateful
from typing import Optional
import can


@flojoy(deps={"python-can": "4.2.2"})
def PCAN_READ(
    PCAN_address: str,
    timeout: int = 10,
    default: Optional[DataContainer] = None
) -> Stateful:
    """Read data from a PCAN device.

    Read data from a PCAN device. This blocks should be compatible with all devices that support the PCAN interface.
    A connection to the device is required. Use the PCAN_CONNECT block to connect to a PCAN device.

    For Windows and Linux compatibilities, the following Drviers are required:
        → https://www.peak-system.com/Drivers.523.0.html?&L=1
    For MacOS compatibilities, the following Drivers are required:
        → https://mac-can.github.io/

    Parameters
    ----------
    PCAN_address : str
        The PCAN device address to connect to. This address can be found by the PCAN_DETECT_AVAILABLE_DEVICES block.
        → Example: "PCAN_USBBUS1"
    timeout : int
        The timeout in seconds to wait for a message. Default is 10.

    Returns
    -------
    Stateful : can.message.Message
        Return a can bus message
    """
    
    assert PCAN_address == "", "Please provide a valid PCAN address"

    connection: can.interface.Bus = DeviceConnectionManager.get_connection(PCAN_address).get_handle()

    msg = connection.recv(timeout)

    if msg is None:
        raise Exception("No data received")

    return Stateful(msg)
