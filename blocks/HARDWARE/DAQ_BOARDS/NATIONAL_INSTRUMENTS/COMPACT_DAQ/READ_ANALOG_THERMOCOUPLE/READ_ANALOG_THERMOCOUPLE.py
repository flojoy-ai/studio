
from flojoy import flojoy, DataContainer, String, DeviceConnectionManager, NIDAQmxConnection, Vector
from typing import Optional, Literal
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"})
def READ_ANALOG_THERMOCOUPLE(
    cDAQ: NIDAQmxConnection,
    min_val: float = 0.0,
    max_val: float = 100.0,
    units: Literal["Celsius", "Fahrenheit", "Rankine", "Kelvin"] = "Celcius",
    thermocouple_type: Literal["K", "R", "N", "E", "J", "S", "T", "B"] = "J",
    cold_junction_source: Literal["Constant", "Channel", "Built In"] = "Constant",
    cold_junction_value: float = 25.0,
    cold_junction_channel: str = "",
    number_of_samples_per_channel: int = 1,
    timeout: float = 10.0,
    wait_infinitely: bool = False,
    default: Optional[DataContainer] = None,
) -> Vector:
    """Reads one or more thermocouple samples from a National Instruments compactDAQ device.
    
    Read one or more thermocouple samples from a National Instruments compactDAQ device. The device must support thermocouple measurements.

    Parameters
    ----------
    device_input_adress : String
        The device and channel(s) to read from. The device should be in the format "Dev1/ai0" or "Dev1/ai0:3" for multiple channels.
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
    number_of_samples_per_channel : int
        Number of samples to read.
    timeout : float
        Time to wait for samples to become available. If you set timeout to 0, the method tries once to read the requested samples and returns an error if it is unable to.
    wait_infinitely : bool
        If True, the method waits indefinitely for samples to become available. If False, the method waits for the amount of time specified by timeout.

    Returns
    -------
    Vector
        Samples read from the device.
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

    assert number_of_samples_per_channel > 0, "number_of_samples_per_channel must be greater than 0"
    # TODO Add REAL_ALL_AVAIALBLE | nb_sample = number_of_samples_per_channel if not real_all_available_samples else nidaqmx.constants.READ_ALL_AVAILABLE
    timeout = timeout if not wait_infinitely else nidaqmx.constants.WAIT_INFINITELY

    with nidaqmx.Task() as task:
        task.ai_channels.add_ai_thrmcpl_chan(
            cDAQ.get_id(),
            min_val=min_val,
            max_val=max_val,
            units=units,
            thermocouple_type=thermocouple_type,
            cjc_source=cold_junction_source,
            cjc_val=cold_junction_value,
            cjc_channel=cold_junction_channel,
        )
        values = task.read(number_of_samples_per_channel=number_of_samples_per_channel, timeout=timeout)
        return Vector(values)

