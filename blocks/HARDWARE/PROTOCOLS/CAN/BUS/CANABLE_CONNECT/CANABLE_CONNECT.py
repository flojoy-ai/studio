from flojoy import (
    DataContainer,
    SerialDevice,
    flojoy,
    DeviceConnectionManager,
    HardwareDevice,
)
from typing import Optional
import can


@flojoy(deps={"python-can": "4.3.1"})
def CANABLE_CONNECT(
    device: SerialDevice,
    CAN_address: str,
    bitrate: int = 500000,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Connect to a slcan-compatible USB-to-CAN adapter.

    Parameters
    ----------
    device : SerialDevice
        The serial device to connect to.
    CAN_address : str
        The `CAN_address` to use in other blocks to refer to this connection.
        Note: This is not the physical address of the device, but rather a unique identifier for the connection. Needed since not all CAN bus connection can be retreive with a SerialDevice.
    bitrate : int
        The bitrate to use for the CAN bus.

    Returns
    -------
    Optional[DataContainer]
        None
    """

    session = can.interface.Bus(
        interface="slcan", channel=device.get_port(), bitrate=bitrate
    )

    DeviceConnectionManager.register_connection(HardwareDevice(CAN_address), session)

    return None
