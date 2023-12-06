from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def VERTICAL_SCALE_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    channel: int = 1,
    scale: float = 1.0,
) -> String:
    """Set the MSO2XX oscilloscope viewport.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    channel : int, default=1
        Oscilloscope channel to affect
    scale : float, default=1
        Vertical viewport division, in V

    Returns
    -------
    String
        Vertical scale
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    scope.set_and_check(f":CH{channel}:SCAL", scale)

    return String(s="Vertical scale")
