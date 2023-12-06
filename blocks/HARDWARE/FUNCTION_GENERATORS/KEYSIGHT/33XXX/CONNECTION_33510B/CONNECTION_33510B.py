from flojoy import VisaDevice, flojoy, DataContainer
from flojoy.connection_manager import DeviceConnectionManager
from typing import Optional
from qcodes.instrument_drivers.Keysight import Keysight33512B
from usb.core import USBError


@flojoy()
def CONNECTION_33510B(
    device: VisaDevice,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Connect Flojoy to a 33510B function generator.

    The connection is made with the VISA address in the Flojoy UI.

    This node should also work with compatible Keysight 33XXX wavefunction
    generators (although they are untested).

    Parameters
    ----------
    device: VisaDevice
        The VISA address to connect to.

    Returns
    -------
    DataContainer
        Optional: None
    """

    try:
        ks = Keysight33512B(
            "ks",
            device.get_id(),
            visalib="@py",
            device_clear=False,
        )
    except USBError as err:
        raise Exception(
            "USB port error. Trying unplugging+replugging the port."
        ) from err

    DeviceConnectionManager.register_connection(device, ks)

    return None
