from flojoy import flojoy, DataContainer, NIDevice, DeviceConnectionManager, NIDAQmxDevice
from typing import Optional
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"})
def CONNECT_CDAQ(
    cDAQ: NIDAQmxDevice,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Connect to a National Instrument compactDAQ device

    Connect to a National Instrument compactDAQ device. This function should be compatiable with all NI-DAQmx devices.
    Tested with a NI cDAQ-9171 chassis and a NI 9203 analog input module.

    Parameters
    ----------
    device: VisaDevice
        The VISA address to connect to.

    Returns
    -------
    DataContainer
        None.
    """

    id = cDAQ.get_id()
    device, channel = id.split('/')
    devices = nidaqmx.system.System().devices

    device = devices[device]
    DeviceConnectionManager.register_connection(NIDevice(id), device)

    return None
