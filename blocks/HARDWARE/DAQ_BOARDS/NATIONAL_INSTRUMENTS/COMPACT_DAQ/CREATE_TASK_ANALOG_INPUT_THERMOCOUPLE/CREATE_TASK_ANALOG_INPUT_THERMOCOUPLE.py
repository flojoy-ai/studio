from flojoy import flojoy, DataContainer, NIDAQmxDevice, DeviceConnectionManager
from typing import Optional, Literal
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"})
def CREATE_TASK_ANALOG_INPUT_THERMOCOUPLE(
    cDAQ_start_channel: NIDAQmxDevice,
    cDAQ_end_channel: NIDAQmxDevice,
    min_val: float = 0.0,
    max_val: float = 100.0,
    units: Literal["Celsius", "Fahrenheit", "Rankine", "Kelvin"] = "Celsius",
    thermocouple_type: Literal["K", "R", "N", "E", "J", "S", "T", "B"] = "J",
    cold_junction_source: Literal["Constant", "Channel", "Built In"] = "Constant",
    cold_junction_value: float = 25.0,
    cold_junction_channel: str = "",
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Creates a task with (a) channel(s) that use a thermocouple to measure temperature.

    Compatible with National Instruments compactDAQ devices. The device must have a analog thermocouple input channel.
    Tested with a simulated NI-9219 module.

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
        The units to use to return thermocouple measurements.
    cold_junction_source : Literal
        Optional, specifies the source of cold junction compensation.
    cold_junction_value: Optional[float]
        Optional, specifies the cold junction temperature in **units** if cold_junction_source is set to "Constant".
    cold_junction_channel : str
        Optional, specifies the source of cold junction compensation if cold_junction_source is set to "Channel".

    Returns
    -------
    Optional[DataContainer]
        None
    """
    
    units = {
        "Celsius": nidaqmx.constants.TemperatureUnits.DEG_C,
        "Fahrenheit": nidaqmx.constants.TemperatureUnits.DEG_F,
        "Rankine": nidaqmx.constants.TemperatureUnits.DEG_R,
        "Kelvin": nidaqmx.constants.TemperatureUnits.K
    }[units]

    thermocouple_type = {
        "K": nidaqmx.constants.ThermocoupleType.K,
        "R": nidaqmx.constants.ThermocoupleType.R,
        "N": nidaqmx.constants.ThermocoupleType.N,
        "E": nidaqmx.constants.ThermocoupleType.E,
        "J": nidaqmx.constants.ThermocoupleType.J,
        "S": nidaqmx.constants.ThermocoupleType.S,
        "T": nidaqmx.constants.ThermocoupleType.T,
        "B": nidaqmx.constants.ThermocoupleType.B,
    }[thermocouple_type]

    cold_junction_source = {
        "Constant": nidaqmx.constants.CJCSource.CONSTANT_USER_VALUE,
        "Channel": nidaqmx.constants.CJCSource.SCANNABLE_CHANNEL,
        "Built In": nidaqmx.constants.CJCSource.BUILT_IN,
    }[cold_junction_source]

    # Build the physical channels strin
    name, address = cDAQ_start_channel.get_id().split('/')
    if cDAQ_end_channel:
        _, address_end = cDAQ_end_channel.get_id().split('/')
        address = f"{address}:{address_end[2:]}"
    physical_channels = f"{name}/{address}"

    # Recreate a with Task() as task: behavior without the traceback on exit
    task = nidaqmx.Task()
    DeviceConnectionManager.register_connection(cDAQ_start_channel, task, lambda task: task.__exit__(None, None, None))
    task.ai_channels.add_ai_thrmcpl_chan(
        physical_channels,
        min_val=min_val,
        max_val=max_val,
        units=units,
        thermocouple_type=thermocouple_type,
        cjc_source=cold_junction_source,
        cjc_val=cold_junction_value,
        cjc_channel=cold_junction_channel,
    )
