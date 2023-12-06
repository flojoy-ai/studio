from flojoy import flojoy, DataContainer, NIDevice
from flojoy.connection_manager import DeviceConnectionManager
from typing import Optional
import nidmm


@flojoy(deps={"nidmm": "1.4.6"})
def CONNECTION_USB4065(
    NI_address: str = "Dev1",
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Connect Flojoy to an NI USB4065 DAQ board.

    Parameters
    ----------
    NI_address: str
        The NI instrument address for the instrument (e.g. 'Dev0', 'Dev1').

    Returns
    -------
    DataContainer
        Optional: None
    """

    session = nidmm.Session(NI_address)
    DeviceConnectionManager.register_connection(NIDevice(NI_address), session)

    return None
