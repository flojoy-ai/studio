from flojoy import flojoy, DataContainer, NIDAQmxDevice, DeviceConnectionManager
from typing import Optional, Literal
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"})
def CREATE_TASK_ANALOG_INPUT_VOLTAGE(
    cDAQ_start_channel: NIDAQmxDevice,
    cDAQ_end_channel: NIDAQmxDevice,
    min_val: float = -5.00,
    max_val: float = 5.00,
    units: Literal["VOLTS"] = "VOLTS",
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Creates a task with (a) channel(s) to measure voltage.

    Compatible with National Instruments compactDAQ devices. The device must have a voltage input channel.
    Tested on a simulated NI-9229 module.

    This instrument will likely only be compatible with Windows systems due to
    NI driver availablity. To use the instrument you must install the runtime:

    https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html

    Parameters
    ----------
    cDAQ_start_channel : NIDAQmxDevice
        The device and channel to read from.
    cDAQ_end_channel : NIDAQmxDevice
        To read from only one channel, set this to the same as cDAQ_start_channel. To read from multiple channels, set this to the last channel you want to read from.
    min_val : float
        Specifies in **units** the minimum value you expect to measure.
    max_val : float
        Specifies in **units** the maximum value you expect to measure.
    units : Literal
        The units to use to return current measurements.

    Returns
    -------
    Optional[DataContainer]
        None
    """

    # Build the physical channels strin
    name, address = cDAQ_start_channel.get_id().split("/")
    if cDAQ_end_channel:
        _, address_end = cDAQ_end_channel.get_id().split("/")
        address = f"{address}:{address_end[2:]}"
    physical_channels = f"{name}/{address}"

    units = (
        nidaqmx.constants.VoltageUnits.VOLTS
    )  # TODO: Support TEDS info associated with the channel and custom scale

    # Recreate a with Task() as task: behavior without the traceback on exit
    task = nidaqmx.Task()
    DeviceConnectionManager.register_connection(
        cDAQ_start_channel, task, lambda task: task.__exit__(None, None, None)
    )
    task.ai_channels.add_ai_voltage_chan(
        physical_channels, min_val=min_val, max_val=max_val, units=units
    )
