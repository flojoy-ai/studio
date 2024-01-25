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
    """Creates a task with channel(s) to measure temperature using a thermocouple.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx. Tested with a simulated NI-9219 module.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    cDAQ_start_channel : NIDAQmxDevice
        The device and channel to read from.
    cDAQ_end_channel : NIDAQmxDevice
        To read from only one channel, set this to the same as `cDAQ_start_channel`. To read from multiple channels, set this to the last channel you want to read from.
    min_val : float, optional
        Specifies in **units** the minimum value you expect to measure (default is 0.0).
    max_val : float, optional
        Specifies in **units** the maximum value you expect to measure (default is 100.0).
    units : Literal, optional
        The units to use to return thermocouple measurements (default is "Celsius").
    thermocouple_type : Literal, optional
        The type of thermocouple being used (default is "J").
    cold_junction_source : Literal, optional
        Specifies the source of cold junction compensation (default is "Constant").
    cold_junction_value : Optional[float], optional
        Specifies the cold junction temperature in **units** if `cold_junction_source` is set to "Constant" (default is 25.0).
    cold_junction_channel : str, optional
        Specifies the source of cold junction compensation if `cold_junction_source` is set to "Channel" (default is "").

    Returns
    -------
    Optional[DataContainer]
        This block does not return any meaningful data; it is designed for creating a task to measure temperature using a thermocouple.
    """

    units = {
        "Celsius": nidaqmx.constants.TemperatureUnits.DEG_C,
        "Fahrenheit": nidaqmx.constants.TemperatureUnits.DEG_F,
        "Rankine": nidaqmx.constants.TemperatureUnits.DEG_R,
        "Kelvin": nidaqmx.constants.TemperatureUnits.K,
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
    name, address = cDAQ_start_channel.get_id().split("/")
    if cDAQ_end_channel:
        _, address_end = cDAQ_end_channel.get_id().split("/")
        address = f"{address}:{address_end[2:]}"
    physical_channels = f"{name}/{address}"

    task = nidaqmx.Task()
    DeviceConnectionManager.register_connection(
        cDAQ_start_channel, task, lambda task: task.__exit__(None, None, None)
    )
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
