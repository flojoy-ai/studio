from flojoy import VisaDevice, flojoy, TextBlob
from flojoy.connection_manager import DeviceConnectionManager


@flojoy
def CONNECT_DMM7510(
    device: VisaDevice,
) -> TextBlob:
    """Open a VISA connection to a Keithley DMM7510.

    Also sets the communication language to TSP.

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

    dmm = DeviceConnectionManager.tm.add_dmm(device_addr)
    dmm.write("*LANG TSP")
    lang = dmm.query("*LANG?")
    if lang != "TSP":
        raise ValueError(
            "Command set language not set correctly. Try setting to 'TSP' manually."
        )

    DeviceConnectionManager.register_connection(device, dmm)

    return TextBlob(text_blob=device_addr)
