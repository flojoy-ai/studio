from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def EDGE_TRIGGER_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    channel: int = 1,
    level: float = 1.0,
    edge_coupling: Literal[
        "unchanged", "dc", "hfrej", "lfrej", "noiserej"
    ] = "unchanged",
    edge_slope: Literal["unchanged", "rise", "fall", "either"] = "unchanged",
) -> String:
    """Set the MSO2XX edge trigger settings.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    channel : int, default=1
        Oscilloscope channel to affect
    level : float, default=1
        The trigger threshold voltage, in V.
    edge_coupling : select, default=unchanged
        The type of edge coupling to use for triggering.
    edge_slope : select, default=unchanged
        The type of edge slope to use for triggering.

    Returns
    -------
    String
        Trigger settings
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    if edge_coupling != "unchanged":
        scope.commands.trigger.a.edge.coupling.write(edge_coupling)
    if edge_slope != "unchanged":
        scope.commands.trigger.a.edge.slope.write(edge_slope)
    scope.commands.trigger.a.level.ch[channel].write(level)

    return String(s="Trigger settings")
