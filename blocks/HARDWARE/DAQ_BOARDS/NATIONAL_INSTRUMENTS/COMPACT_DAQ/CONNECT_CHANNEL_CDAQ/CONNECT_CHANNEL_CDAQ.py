from flojoy import flojoy, DataContainer, String, DeviceConnectionManager, NIDevice
from typing import Optional
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"})
def CONNECT_CHANNEL_CDAQ(
    targeted_channel: str,
    device_adress: String,
) -> Optional[DataContainer]:

    device: nidaqmx.system.device.Device = DeviceConnectionManager.get_connection(device_adress.s)._handle
    target = f"{device.name}/{targeted_channel}"

    available_channels = [chan.name for chan in device.ai_physical_chans]
    available_channels_name = [chan.name.replace(f"{device.name}/", "") for chan in device.ai_physical_chans]
    assert target in available_channels, f"Available channels are: {', '.join(available_channels_name)}"

    channel = device.ai_physical_chans[targeted_channel]
    DeviceConnectionManager.register_connection(NIDevice(target), channel, cleanup=lambda x: x)

    return String(target)
