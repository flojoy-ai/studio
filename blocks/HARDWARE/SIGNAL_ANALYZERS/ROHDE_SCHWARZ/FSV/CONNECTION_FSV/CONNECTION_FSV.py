from flojoy import VisaDevice, flojoy, DataContainer
from flojoy.connection_manager import DeviceConnectionManager
from typing import Optional
from pyvisa import ResourceManager


@flojoy()
def CONNECTION_FSV(
    device: VisaDevice,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Connect Flojoy to a FSV network analyzer.

    The connection is made with the VISA address in the Flojoy UI.

    This block should also work with compatible R&S network analyzers.

    Parameters
    ----------
    device: VisaDevice
        The VISA address to connect to.

    Returns
    -------
    DataContainer
        None
    """

    rm = ResourceManager("@py")
    rohde = rm.open_resource(device.get_id())
    rohde.read_termination = "\n"
    rohde.write_termination = "\n"

    DeviceConnectionManager.register_connection(device, rohde)

    return None
