from flojoy import flojoy, DataContainer, Vector, NIDAQmxDevice, Matrix
from typing import Literal, Optional
import nidaqmx
import logging
import numpy as np


@flojoy(deps={"nidaqmx": "0.9.0"})
def READ_ANALOG_CURRENT(
    cDAQ_start_channel: NIDAQmxDevice,
    cDAQ_end_channel: NIDAQmxDevice,
    min_val: float = -0.01,
    max_val: float = 0.01,
    units: Literal["AMPS"] = "AMPS",
    number_of_samples_per_channel: int = 1,
    timeout: float = 10.0,
    wait_infinitely: bool = False,
    default: Optional[DataContainer] = None,
) -> Vector | Matrix:
    """Reads one or more current samples from a National Instruments compactDAQ device.
    
    Read one or more current samples from a National Instruments compactDAQ device. The device must have a current input channel. The method returns an error if the device does not have a current input channel.

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
    number_of_samples_per_channel : int
        Number of samples to read.
    timeout : float
        Time to wait for samples to become available. If you set timeout to 0, the method tries once to read the requested samples and returns an error if it is unable to.
    wait_infinitely : bool
        If True, the method waits indefinitely for samples to become available. If False, the method waits for the amount of time specified by timeout.

    Returns
    -------
    Vector
        The me
    """
    
    # Build the physical channels strin
    name, address = cDAQ_start_channel.get_id().split('/')
    if cDAQ_end_channel:
        _, address_end = cDAQ_end_channel.get_id().split('/')
        address = f"{address}:{address_end[2:]}"
    physical_channels = f"{name}/{address}"

    units = nidaqmx.constants.CurrentUnits.AMPS  # TODO: Support TEDS info associated with the channel and custom scale

    assert number_of_samples_per_channel > 0, "number_of_samples_per_channel must be greater than 0"
    # TODO Add REAL_ALL_AVAIALBLE | nb_sample = number_of_samples_per_channel if not real_all_available_samples else nidaqmx.constants.READ_ALL_AVAILABLE
    timeout = timeout if not wait_infinitely else nidaqmx.constants.WAIT_INFINITELY

    with nidaqmx.Task() as task:
        task.ai_channels.add_ai_current_chan(physical_channels, min_val=min_val, max_val=max_val, units=units)  # TODO: Add shunt resistor option
        values = np.array(task.read(number_of_samples_per_channel=number_of_samples_per_channel, timeout=timeout))
        return Vector(values) if len(values) == 1 else Matrix(values)
