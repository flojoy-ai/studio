from tm_devices import DeviceManager
from flojoy import VisaDevice, flojoy, TextBlob
from flojoy.connection_manager import DeviceConnectionManager


@flojoy(deps={"tm_devices": "0.1.24"})
def CONNECT_MSO(device: VisaDevice) -> TextBlob:
    """Open a VISA connection to an MSOXX Tektronix oscilloscope.

    Parameters
    ----------
    device: VisaDevice
        The connected VISA device.

    Returns
    -------
    device_addr: TextBlob
        The IP address of the VISA device.
    """

    dm = DeviceManager()
    device_addr = device.get_address()

    # TCPIP0::169.254.187.99::INSTR vs just 169.254.187.99
    # isolate scope IP
    IP = device_addr.split("::")[1]

    scope = dm.add_scope(IP)

    def cleanup(handle):
        dm, _ = handle
        dm.cleanup_all_devices()
        dm.remove_all_devices()
        dm.close()

    DeviceConnectionManager.register_connection(device, (dm, scope), cleanup=cleanup)

    return TextBlob(text_blob=device_addr)
