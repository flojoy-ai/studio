
from flojoy import flojoy, DataContainer, NIDAQmxDevice, DeviceConnectionManager
from typing import Optional, Literal
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"})
def CREATE_TASK_ANALOG_INPUT_ACCELEROMETER(
    cDAQ_start_channel: NIDAQmxDevice,
    cDAQ_end_channel: NIDAQmxDevice,
    min_val: float = - 5.0,
    max_val: float = 5.0,
    units: Literal["G", "Inches per second squared", "Meters per second squared"] = "G",
    sensitivity: float = 1000.0,
    sensitivity_units: Literal[
        "Millivolts per G"
        "Volts per G"
    ] = "Millivolts per G",
    current_excitation_source: Literal[
        "External",
        "Internal",
        "None"
    ] = "Internal",
    current_excitation_value: float = 0.004,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Creates a task with (a) channel(s) that use an accelerometer to measure acceleration.

    Compatible with National Instruments compactDAQ devices. The device must have a analog accelerometer input channel.
    Tested with a simulated NI-XXXX module.

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
        The units to use to return accelerometer measurements.
    sensitivity : float
        Is the sensitivity of the sensor. This value is in the units you specify with the sensitivity_units input. Refer to the sensor documentation to determine this value.
    sensitivity_units : Literal
        Specifies the units of the sensitivity input.
    current_excitation_source : Literal
        Specifies the source of excitation.
    current_excitation_value : float
        Specifies in amperes the amount of excitation to supply to the sensor. Refer to the sensor documentation to determine this value.

    Returns
    -------
    Optional[DataContainer]
        None
    """
    
    units = {
        "G": nidaqmx.constants.AccelUnits.G,
        "Inches per second squared": nidaqmx.constants.AccelUnits.INCHES_PER_SECOND_SQUARED,
        "Meters per second squared": nidaqmx.constants.AccelUnits.METERS_PER_SECOND_SQUARED
    }[units]

    sensitivity_units = {
        "Millivolts per G": nidaqmx.constants.AccelSensitivityUnits.MILLIVOLTS_PER_G,
        "Volts per G": nidaqmx.constants.AccelSensitivityUnits.VOLTS_PER_G,
    }[sensitivity_units]

    current_excitation_source = {
        "External": nidaqmx.constants.ExcitationSource.EXTERNAL,
        "Internal": nidaqmx.constants.ExcitationSource.INTERNAL,
        "None": nidaqmx.constants.ExcitationSource.NONE
    }[current_excitation_source]

    # Build the physical channels strin
    name, address = cDAQ_start_channel.get_id().split('/')
    if cDAQ_end_channel:
        _, address_end = cDAQ_end_channel.get_id().split('/')
        address = f"{address}:{address_end[2:]}"
    physical_channels = f"{name}/{address}"

    task = nidaqmx.Task()
    DeviceConnectionManager.register_connection(cDAQ_start_channel, task, lambda task: task.__exit__(None, None, None))
    task.ai_channels.add_ai_accel_chan(
        physical_channels,
        min_val=min_val,
        max_val=max_val,
        units=units,
        sensitivity_units=sensitivity_units,
        sensitivity=sensitivity,
        current_excit_source=current_excitation_source,
        current_excit_val=current_excitation_value
    )


