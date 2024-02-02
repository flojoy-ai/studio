from typing import Optional
from flojoy import flojoy, DeviceConnectionManager, Stateful, DataContainer
import can


@flojoy(deps={"python-can": "4.3.1"})
def SEND_PERIODIC_CAN_MESSAGE(
    CAN_address: str,
    message: Stateful,
    period: float,
    duration: Optional[float] = None,
    default: Optional[DataContainer]
) -> Optional[DataContainer]:
    """Send a periodic message to a CAN bus.

    Send a message to a CAN device periodically. This block should be compatible with all devices that support the CAN interface.

    Parameters
    ----------
    CAN_address : str
        The CAN device address to connect to.
    message : Stateful
        A list of messages to send to the CAN device.
    period: float
        The period in seconds between messages
    duration: Optional float
        Approximate duration in seconds to continue sending messages. If no duration is provided, the task will continue indefinitely

    Returns
    -------
    DataContainer
        Optional: None
    """
    connection: can.interface.Bus = DeviceConnectionManager.get_connection(
        CAN_address
    ).get_handle()

    connection.send_periodic(message, period, duration=duration)

    return None
