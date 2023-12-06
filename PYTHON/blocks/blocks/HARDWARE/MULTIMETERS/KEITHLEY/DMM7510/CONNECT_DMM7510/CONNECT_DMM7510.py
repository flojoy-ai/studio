from flojoy import VisaDevice, flojoy, String
from flojoy.connection_manager import DeviceConnectionManager


@flojoy
def CONNECT_DMM7510(
    device: VisaDevice,
) -> String:
    """Open a VISA connection to a Keithley DMM7510.

    Also sets the communication language to TSP.

    Parameters
    ----------
    device: VisaDevice
        The connected VISA device.

    Returns
    -------
    device_addr: String
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

    return String(s=device_addr)
