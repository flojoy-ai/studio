from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def VERTICAL_POSITION_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    channel: int = 1,
    position: float = 0,
) -> String:
    """Set the MSO2XX oscilloscope vertical offset for the specified channel.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    channel : int, default=1
        Oscilloscope channel to affect
    scale : float, default=0
        Vertical offset, in divisions

    Returns
    -------
    String
        Vertical position
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    scope.set_and_check(f":CH{channel}:POSITION", position)

    return String(s="Vertical position")
