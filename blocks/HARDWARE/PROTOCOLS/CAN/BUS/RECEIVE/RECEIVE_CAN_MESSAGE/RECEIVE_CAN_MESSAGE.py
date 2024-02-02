from flojoy import flojoy, DataContainer, DeviceConnectionManager, Stateful
from typing import Optional
import can


@flojoy(deps={"python-can": "4.3.1"})
def RECEIVE_CAN_MESSAGE(
    CAN_address: str,
    timeout: int = 10,
    raise_error: bool = True,
    default: Optional[DataContainer] = None
) -> Stateful:
    """Read data from a CAN Bus connection.

    This block is used to read data from a CAN Bus connection. A connection to the CAN device must be established using the CAN_CONNECT block.

    Parameters
    ----------
    PCAN_address : str
        The CAN device address to connect to.
    timeout : int
        The timeout in seconds to wait for a message. Default is 10.
    raise_error : bool
        If True, an exception will be raised if no data is received. Default is True.

    Returns
    -------
    Stateful : can.message.Message
        Return a can bus message
    """

    connection: can.interface.Bus = DeviceConnectionManager.get_connection(
        CAN_address
    ).get_handle()

    msg = connection.recv(timeout)

    if msg is None:
        if raise_error:
            raise Exception("No data received")
        else:
            return Stateful([])

    return Stateful([msg])
