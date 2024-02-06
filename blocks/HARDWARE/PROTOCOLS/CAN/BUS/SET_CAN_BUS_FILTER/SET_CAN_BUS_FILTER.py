from flojoy import flojoy, DeviceConnectionManager, DataContainer
from typing import Optional
import can


@flojoy(deps={"python-can": "4.3.1"})
def SET_CAN_BUS_FILTER(
    CAN_address: str,
    can_id: int,
    can_mask: int,
    extended: bool = False,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Attach a message filter to a CAN bus connection.

    Setup a message filtering can be set up for each bus.
    Where the interface supports it, this is carried out in the hardware or kernel layer - not in Python.
    All messages that match at least one filter are returned.

    Parameters
    ----------
    CAN_address : str
        The CAN bus address to attach the filter to.
    can_id : int
        The ID of the message to filter.
    can_mask : int
        todo
    extended : bool
        If true, only matches messages where <received_is_extended> == extended.

    Returns
    -------
    DataContainer
        Optional: None
    """
    connection: can.interface.Bus = DeviceConnectionManager.get_connection(
        CAN_address
    ).get_handle()

    connection.set_filters(
        [{"can_id": can_id, "can_mask": can_mask, "extended": extended}]
    )

    return None
