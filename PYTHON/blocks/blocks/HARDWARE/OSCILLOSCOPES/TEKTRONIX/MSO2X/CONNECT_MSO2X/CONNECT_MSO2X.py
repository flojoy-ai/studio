from flojoy import VisaDevice, flojoy, TextBlob
from flojoy.connection_manager import DeviceConnectionManager


@flojoy(deps={"tm_devices": "1"})
def CONNECT_MSO2X(
    device: VisaDevice,
) -> TextBlob:
    """Open a VISA connection to an MSO2X Tektronix oscilloscope.

    Parameters
    ----------
    device: VisaDevice
        The connected VISA device.

    Returns
    -------
    device_addr: TextBlob
        The IP or VISA address of the VISA device.
    """

    device_addr = device.get_address()

    scope = DeviceConnectionManager.tm.add_scope(device_addr)
    DeviceConnectionManager.register_connection(device, scope)

    return TextBlob(text_blob=device_addr)
