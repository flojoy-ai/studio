from flojoy import VisaDevice, flojoy, String
from flojoy.connection_manager import DeviceConnectionManager


@flojoy(deps={"tm_devices": "1.0"})
def CONNECT_2450(
    device: VisaDevice,
) -> String:
    """Open a VISA connection to an Keithley 2450 SourceMeter.

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

    smu = DeviceConnectionManager.tm.add_smu(device_addr)
    smu.write("*LANG TSP")
    lang = smu.query("*LANG?")
    if lang != "TSP":
        raise ValueError(
            "Command set language not set correctly. Try setting to 'TSP' manually."
        )

    DeviceConnectionManager.register_connection(device, smu)

    return String(s=device_addr)
