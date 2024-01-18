
from flojoy import flojoy, DataContainer, String, DeviceConnectionManager, NIDevice, Vector, Boolean
from typing import Optional, Literal
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"})
def READ_ANALOG_VOLTAGE(
    device_input_adress: String,
    min_val: float = -5.00,
    max_val: float = 5.00,
    units: Literal["VOLTS"] = "VOLTS",
    number_of_samples_per_channel: int = 1,
    timeout: float = 10.0,
    wait_infinitely: bool = False,
) -> Optional[DataContainer]:
    """Reads one or more voltage samples from a National Instruments compactDAQ device.
    
    TODO: Add more info and add input for current channel

    Parameters
    ----------
    device_input_adress : String
        The device and channel(s) to read from. The device should be in the format "Dev1/ai0" or "Dev1/ai0:3" for multiple channels.
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

    units = nidaqmx.constants.VoltageUnits.VOLTS  # TODO: Support TEDS info associated with the channel and custom scale

    assert number_of_samples_per_channel > 0, "number_of_samples_per_channel must be greater than 0"
    # TODO Add REAL_ALL_AVAIALBLE | nb_sample = number_of_samples_per_channel if not real_all_available_samples else nidaqmx.constants.READ_ALL_AVAILABLE
    timeout = timeout if not wait_infinitely else nidaqmx.constants.WAIT_INFINITELY

    with nidaqmx.Task() as task:
        task.ai_channels.add
        task.ai_channels.add_ai_voltage_chan(device_input_adress.s, min_val=min_val, max_val=max_val, units=units)
        values = task.read(number_of_samples_per_channel=number_of_samples_per_channel, timeout=timeout)
        return Vector(values)

