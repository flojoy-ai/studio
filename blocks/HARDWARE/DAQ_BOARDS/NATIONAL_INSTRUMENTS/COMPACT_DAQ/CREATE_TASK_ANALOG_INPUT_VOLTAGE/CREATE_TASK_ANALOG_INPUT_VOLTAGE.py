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
    """Creates a task with channel(s) to measure voltage.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx. Tested on a simulated NI-9229 module.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    cDAQ_start_channel : NIDAQmxDevice
        The device and channel to read from.
    cDAQ_end_channel : NIDAQmxDevice
        To read from only one channel, set this to the same as `cDAQ_start_channel`. To read from multiple channels, set this to the last channel you want to read from.
    min_val : float, optional
        Specifies in **units** the minimum value you expect to measure (default is -5.00).
    max_val : float, optional
        Specifies in **units** the maximum value you expect to measure (default is 5.00).
    units : Literal, optional
        The units to use to return voltage measurements (default is "VOLTS").

    Returns
    -------
    Optional[DataContainer]
        This block does not return any meaningful data; it is designed for creating a task to measure voltage.
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

    task = nidaqmx.Task()
    DeviceConnectionManager.register_connection(
        cDAQ_start_channel, task, lambda task: task.__exit__(None, None, None)
    )
    task.ai_channels.add_ai_voltage_chan(
        physical_channels, min_val=min_val, max_val=max_val, units=units
    )
