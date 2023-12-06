from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, TextBlob


@flojoy(inject_connection=True)
def FUNCTION_DMM7510(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    function: Literal[
        "DC voltage",
        "DC current",
        "AC voltage",
        "AC current",
        "2W resistance",
        "4W resistance",
        "temperature",
        "capacitance",
        "continuity",
        "diode",
        "period",
        "frequency",
        "DCV ratio",
    ] = "DC voltage",
) -> TextBlob:
    """Changes the measurement function for the DMM7510.

    Requires a CONNECT_DMM7510 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_DMM7510 block).
    function : select, default=DC voltage
        Select the measurement function

    Returns
    -------
    TextBlob
        Measurement
    """

    dmm = connection.get_handle()

    match function:
        case "DC voltage":
            dmm.commands.dmm.measure.func = "dmm.FUNC_DC_VOLTAGE"
        case "DC current":
            dmm.commands.dmm.measure.func = "dmm.FUNC_DC_CURRENT"
        case "AC voltage":
            dmm.commands.dmm.measure.func = "dmm.FUNC_AC_VOLTAGE"
        case "AC current":
            dmm.commands.dmm.measure.func = "dmm.FUNC_AC_CURRENT"
        case "2W resistance":
            dmm.commands.dmm.measure.func = "dmm.FUNC_RESISTANCE"
        case "4W resistance":
            dmm.commands.dmm.measure.func = "dmm.FUNC_4W_RESISTANCE"
        case "temperature":
            dmm.commands.dmm.measure.func = "dmm.FUNC_TEMPERATURE"
        case "capacitance":
            dmm.commands.dmm.measure.func = "dmm.FUNC_CAPACITANCE"
        case "continuity":
            dmm.commands.dmm.measure.func = "dmm.FUNC_CONTINUITY"
        case "diode":
            dmm.commands.dmm.measure.func = "dmm.FUNC_DIODE"
        case "period":
            dmm.commands.dmm.measure.func = "dmm.FUNC_PERIOD"
        case "frequency":
            dmm.commands.dmm.measure.func = "dmm.FUNC_FREQUENCY"
        case "DCV ratio":
            dmm.commands.dmm.measure.func = "dmm.FUNC_DCV_RATIO"

    return TextBlob(text_blob=f"Measure {function}")
