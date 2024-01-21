from flojoy import flojoy, DataContainer, Vector, Matrix, NIDAQmxDevice
from typing import Optional, Literal
import nidaqmx
import numpy as np


@flojoy(deps={"nidaqmx": "0.9.0"})
def READ_ANALOG_VOLTAGE(
    cDAQ_start_channel: NIDAQmxDevice,
    cDAQ_end_channel: NIDAQmxDevice,
    min_val: float = -5.00,
    max_val: float = 5.00,
    units: Literal["VOLTS"] = "VOLTS",
    sample_clock_rate: float = 1000.0,
    number_of_samples_per_channel: int = 1,
    timeout: float = 10.0,
    wait_infinitely: bool = False,
    default: Optional[DataContainer] = None,
) -> Vector:
    """Reads one or more voltage samples from a National Instruments compactDAQ device.
    
    Tested on a simulated NI-9229

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
    sample_clock_rate : float
        Specifies in hertz the rate of the Sample Clock
    number_of_samples_per_channel : int
        Number of samples to read.
    timeout : float
        Time to wait for samples to become available. If you set timeout to 0, the method tries once to read the requested samples and returns an error if it is unable to.
    wait_infinitely : bool
        If True, the method waits indefinitely for samples to become available. If False, the method waits for the amount of time specified by timeout.

    Returns
    -------
    Vector | Matrix
        Samples read from the device.
    """

    # Build the physical channels strin
    name, address = cDAQ_start_channel.get_id().split('/')
    if cDAQ_end_channel:
        _, address_end = cDAQ_end_channel.get_id().split('/')
        address = f"{address}:{address_end[2:]}"
    physical_channels = f"{name}/{address}"

    units = nidaqmx.constants.VoltageUnits.VOLTS  # TODO: Support TEDS info associated with the channel and custom scale

    assert number_of_samples_per_channel > 0, "number_of_samples_per_channel must be greater than 0"
    # TODO Add REAL_ALL_AVAIALBLE | nb_sample = number_of_samples_per_channel if not real_all_available_samples else nidaqmx.constants.READ_ALL_AVAILABLE
    timeout = timeout if not wait_infinitely else nidaqmx.constants.WAIT_INFINITELY

    with nidaqmx.Task() as task:
        task.ai_channels.add_ai_voltage_chan(physical_channels, min_val=min_val, max_val=max_val, units=units)
        task.timing.cfg_samp_clk_timing(rate=sample_clock_rate, samps_per_chan=number_of_samples_per_channel)
        values = np.array(task.read(number_of_samples_per_channel=number_of_samples_per_channel, timeout=timeout))
        return Vector(values) if len(values) == 1 else Matrix(values)

