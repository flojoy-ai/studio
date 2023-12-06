from flojoy import VisaDevice, flojoy, DataContainer
from flojoy.connection_manager import DeviceConnectionManager
from typing import Optional
from flojoy.instruments.tektronix.MDO30xx import TektronixMDO30xx
from usb.core import USBError


@flojoy()
def CONNECTION_MDO3XXX(
    device: VisaDevice,
    num_channels: int = 4,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Connect Flojoy to a MDO3XXX oscilloscope.

    The connection is made with the VISA address in the Flojoy UI.

    This block should also work with compatible Tektronix scopes (untested):
    MDO4xxx, MSO4xxx, and DPO4xxx.

    Parameters
    ----------
    device: VisaDevice
        The VISA address to connect to.
    num_channels: int
        The number of channels on the instrument that are currently in use.

    Returns
    -------
    DataContainer
        Optional: None
    """

    try:
        tek = TektronixMDO30xx(
            "MDO30xx",
            device.get_id(),
            visalib="@py",
            device_clear=False,
            number_of_channels=num_channels,
        )
    except USBError as err:
        raise Exception(
            "USB port error. Trying unplugging+replugging the port."
        ) from err

    DeviceConnectionManager.register_connection(device, tek)

    return None
