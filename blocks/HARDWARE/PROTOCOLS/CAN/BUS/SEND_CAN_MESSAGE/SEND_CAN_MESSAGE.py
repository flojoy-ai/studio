from typing import Optional
from flojoy import flojoy, DeviceConnectionManager, Stateful, DataContainer
import can


@flojoy(deps={"python-can": "4.3.1"})
def SEND_CAN_MESSAGE(
    CAN_address: str, message: Stateful, default: Optional[DataContainer] = None
) -> Optional[DataContainer]:
    """Send a message to a CAN system.

    Send a message to a CAN device. This block should be compatible with all devices that support the CAN interface.
    A connection to the device is required. Use a CONNECT_XCAN block to connect to a CAN device.

    Parameters
    ----------
    CAN_address : str
        The CAN device address to connect to.
    message : Stateful
        A list of messages to send to the CAN device.

    Returns
    -------
    DataContainer
        Optional: None
    """
    connection: can.interface.Bus = DeviceConnectionManager.get_connection(
        CAN_address
    ).get_handle()

    for msg in message.obj:
        connection.send(msg)

    return None
