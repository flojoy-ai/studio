from typing import Optional

from flojoy import DataContainer, VisaDevice, flojoy
from flojoy.connection_manager import DeviceConnectionManager
from qcodes.instrument_drivers.rigol import RigolDS1074Z
from usb.core import USBError


@flojoy
def CONNECTION_DS1074Z(
    device: VisaDevice,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Connect Flojoy to a DS1074Z oscilloscope.

    The connection is made with the VISA address in the Flojoy UI.
    This block should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    device: VisaDevice
        The VISA address to connect to.

    Returns
    -------
    DataContainer
        None
    """

    try:
        rigol = RigolDS1074Z(
            "rigol",
            device.get_id(),
            visalib="@py",
            device_clear=False,
        )
    except USBError as err:
        raise Exception(
            "USB port error. Trying unplugging+replugging the port."
        ) from err

    DeviceConnectionManager.register_connection(device, rigol)

    return None
