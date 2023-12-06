from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(deps={"tm_devices": "1.0"}, inject_connection=True)
def OUTPUT_2450(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    output: Literal["on", "off"] = "on",
) -> String:
    """Turns the source output on or off.

    Use the SOURCE_2450 block to change the source settings.

    Requires a CONNECT_2450 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_2450 block).
    output : select, default=off
        Turn the output on or off.

    Returns
    -------
    String
        Output settings
    """

    # Retrieve oscilloscope instrument connection
    smu = connection.get_handle()

    if output == "on":
        smu.commands.smu.source.output = "smu.ON"
    else:
        smu.commands.smu.source.output = "smu.OFF"

    return String(s=f"Output {output}")
