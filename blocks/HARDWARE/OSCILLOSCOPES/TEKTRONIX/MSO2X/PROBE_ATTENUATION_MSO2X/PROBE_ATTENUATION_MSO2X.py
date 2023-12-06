from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def PROBE_ATTENUATION_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    channel: int = 1,
    attenuation: float = 1.0,
) -> String:
    """Set the MSO2XX probe attenuation for specific channel.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    channel : int, default=1
        Oscilloscope channel to affect
    attenuation : float, default=1
        The attenuation level to set

    Returns
    -------
    String
        Attenuation
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    scope.set_and_check(f":CH{channel}:PROBEFunc:EXTAtten", attenuation)

    return String(s="Attenuation")
