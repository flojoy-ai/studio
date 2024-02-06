from flojoy import flojoy, DeviceConnectionManager, DataContainer
from typing import Optional
import can


@flojoy(deps={"python-can": "4.3.1"})
def REMOVE_CAN_BUS_FILTER(
    CAN_address: str, default: Optional[DataContainer] = None
) -> Optional[DataContainer]:
    """Remove all filters attached to a CAN bus connection.

    Parameters
    ----------
    CAN_address : str
        The CAN bus address to attach the filter to.

    Returns
    -------
    DataContainer
        Optional: None
    """
    connection: can.interface.Bus = DeviceConnectionManager.get_connection(
        CAN_address
    ).get_handle()

    connection.set_filters(None)

    return None
