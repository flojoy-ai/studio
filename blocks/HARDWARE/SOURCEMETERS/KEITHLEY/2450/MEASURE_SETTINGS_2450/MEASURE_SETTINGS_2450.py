from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(deps={"tm_devices": "1.0"}, inject_connection=True)
def MEASURE_SETTINGS_2450(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    measure: Literal["voltage", "current", "resistance", "power"] = "voltage",
    wires: Literal["2", "4"] = "2",
    digits: Literal["3.5", "4.5", "5.5", "6.5"] = "6.5",
    meas_range: float = 0,
) -> String:
    """Changes the measurement settings for the 2450.

    Use the MEASURE_READ_2450 block to return a measurement.

    Requires a CONNECT_2450 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_2450 block).
    measure : select, default=voltage
        Select the measure unit
    wires : select, default=2
        Select 2-wire or 4-wire sense mode.
    digits : select, default=6.5
        Select the number of display digits.
    meas_range : int, default=0
        The measurement range. 0 == AUTO.

    Returns
    -------
    String
        Measurement
    """

    # Retrieve oscilloscope instrument connection
    smu = connection.get_handle()

    smu.commands.smu.measure.displaydigits = f"smu.DIGITS_{digits[0]}_5"

    match measure:
        case "current":
            smu.commands.smu.measure.func = "smu.FUNC_DC_CURRENT"
        case "voltage":
            smu.commands.smu.measure.func = "smu.FUNC_DC_VOLTAGE"
        case "resistance":
            smu.commands.smu.measure.func = "smu.FUNC_DC_RESISTANCE"
        case "power":
            smu.commands.smu.measure.func = "smu.FUNC_DC_POWER"

    if wires == "2":
        smu.commands.smu.SENSE_2WIRE
    else:
        smu.commands.smu.SENSE_4WIRE

    if meas_range == 0:
        smu.commands.smu.measure.autorange = "smu.ON"
    else:
        smu.commands.smu.measure.range = meas_range

    return String(s=f"Measure {measure}")
