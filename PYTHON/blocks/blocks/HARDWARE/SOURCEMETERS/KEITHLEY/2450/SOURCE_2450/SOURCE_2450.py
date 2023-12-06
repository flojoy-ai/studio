from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, TextBlob


@flojoy(deps={"tm_devices": "1.0"}, inject_connection=True)
def SOURCE_2450(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    function: Literal["current", "voltage"] = "voltage",
    level: float = 1.0,
    limit: float = 1.0,
    terminal: Literal["front", "rear"] = "front",
    protect: Literal[
        "NONE",
        "2V",
        "5V",
        "10V",
        "20V",
        "40V",
        "60V",
        "80V",
        "100V",
        "120V",
        "140V",
        "160V",
        "180V",
    ] = "NONE",
) -> TextBlob:
    """Set the source output settings.

    Use the OUTPUT_2450 block to turn the output on or off.

    Requires a CONNECT_2450 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_2450 block).
    function : select, default=voltage
        The type of output to use.
    level : float, default=0
        The fixed voltage or current to output.
    limit : float, default=1
        Output limit (if function=voltage, current is limited and visa versa).
    terminal : select, default=front
        The panel to output from.
    protect : select, default=NONE
        The overvoltage protection value.

    Returns
    -------
    TextBlob
        Source settings
    """

    # Retrieve oscilloscope instrument connection
    smu = connection.get_handle()

    smu.commands.smu.source.protect.level = f"smu.PROTECT_{protect}"

    if terminal == "front":
        smu.commands.smu.terminals = "smu.TERMINALS_FRONT"
    else:
        smu.commands.smu.terminals = "smu.TERMINALS_REAR"

    if function == "current":
        smu.commands.smu.source.func = "smu.FUNC_DC_CURRENT"
        smu.commands.smu.source.vlimit.level = limit
    else:
        smu.commands.smu.source.func = "smu.FUNC_DC_VOLTAGE"
        smu.commands.smu.source.ilimit.level = limit

    smu.commands.smu.source.level = level

    return TextBlob(text_blob="Source settings")
