from flojoy import flojoy, DataContainer, NIDMMDevice, String
from flojoy.connection_manager import DeviceConnectionManager
from typing import Optional
import nidmm


@flojoy
def CONNECTION_USB4065(
    NI_address: NIDMMDevice,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Connect Flojoy to a NI USB-4065 DMM.

    Parameters
    ----------
    NI_address: NIDMMDevice
        The NI DMM instrument to connect to.

    Returns
    -------
    DataContainer
        Optional: None
    """

    device_addr = NI_address.get_address()
    session = nidmm.Session(device_addr)
    DeviceConnectionManager.register_connection(NI_address, session)

    return String(s=device_addr)
