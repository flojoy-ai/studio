from flojoy import VisaDevice, flojoy, TextBlob
from flojoy.connection_manager import DeviceConnectionManager


@flojoy(deps={"tm_devices": "1.0"})
def CONNECT_2450(
    device: VisaDevice,
) -> TextBlob:
    """Open a VISA connection to an Keithley 2450 SourceMeter.

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

    smu = DeviceConnectionManager.tm.add_smu(device_addr)
    smu.write("*LANG TSP")
    lang = smu.query("*LANG?")
    if lang != "TSP":
        raise ValueError(
            "Command set language not set correctly. Try setting to 'TSP' manually."
        )

    DeviceConnectionManager.register_connection(device, smu)

    return TextBlob(text_blob=device_addr)
