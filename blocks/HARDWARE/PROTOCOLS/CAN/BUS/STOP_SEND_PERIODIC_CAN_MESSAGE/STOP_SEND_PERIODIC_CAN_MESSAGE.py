from typing import Optional
from flojoy import flojoy, DeviceConnectionManager, DataContainer
import can


@flojoy(deps={"python-can": "4.3.1"})
def STOP_SEND_PERIODIC_CAN_MESSAGE(
    CAN_address: str, default: Optional[DataContainer] = None
) -> Optional[DataContainer]:
    """Stop sending periodic a message to a CAN Bus.

    Stop sending a message to a CAN device. This block should be compatible with all devices that support the CAN interface.
    A connection to the device is required. Use a CAN_CONNECT block to connect to a CAN device.

    Parameters
    ----------
    CAN_address : str
        The CAN device address to connect to.

    Returns
    -------
    DataContainer
        Optional: None
    """
    connection: can.interface.Bus = DeviceConnectionManager.get_connection(
        CAN_address
    ).get_handle()

    connection.stop_all_periodic_tasks()

    return None
