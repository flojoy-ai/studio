from flojoy import flojoy, DataContainer, String, NIDevice, DeviceConnectionManager, NIDAQmxDevice
from typing import Optional
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"})
def CONNECT_CDAQ(
    NI_device: NIDAQmxDevice,
    targeted_device: str,
    default: Optional[DataContainer] = None,
) -> String:
    """Connect to a National-Instrument compactDAQ device

    Todo

    Parameters
    ----------
    device: VisaDevice
        The VISA address to connect to.

    Returns
    -------
    DataContainer
        None.
    """

    devices = nidaqmx.system.System().devices
    device_names = devices.device_names

    assert len(device_names) > 0, "No NI-cDAQ detected"
    assert targeted_device in device_names, f"No NI-cDAQ with the name {targeted_device}, please select of of the following: {', '.join(device_names)}"

    device = devices[targeted_device]
    DeviceConnectionManager.register_connection(NIDevice(targeted_device), device, cleanup=lambda x: x)

    return String(targeted_device)
