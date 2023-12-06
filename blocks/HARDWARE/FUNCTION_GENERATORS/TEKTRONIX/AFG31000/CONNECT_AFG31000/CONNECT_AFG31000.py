from flojoy import VisaDevice, flojoy, String
from flojoy.connection_manager import DeviceConnectionManager
from pyvisa import ResourceManager
from usb.core import USBError


@flojoy
def CONNECT_AFG31000(
    device: VisaDevice,
) -> String:
    """Connect Flojoy to a AFG31000 function generator.

    The connection is made with the VISA address in the Flojoy UI.

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    device: VisaDevice
        The VISA address to connect to.

    Returns
    -------
    device_addr: String
        The IP or VISA address of the VISA device.
    """

    rm = ResourceManager("@py")
    addr = device.get_id()

    try:
        afg = rm.open_resource(addr)
    except USBError as err:
        raise Exception(
            "USB port error. Trying unplugging+replugging the port."
        ) from err

    afg.read_termination = "\n"
    afg.write_termination = "\n"
    DeviceConnectionManager.register_connection(device, afg)

    return String(s=addr)
