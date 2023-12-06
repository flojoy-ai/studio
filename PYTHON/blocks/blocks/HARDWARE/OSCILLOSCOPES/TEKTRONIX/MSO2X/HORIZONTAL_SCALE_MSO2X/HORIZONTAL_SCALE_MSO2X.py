from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, TextBlob


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def HORIZONTAL_SCALE_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    scale: float = 1e-3,
) -> TextBlob:
    """Set the MSO2X oscilloscope viewport.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    scale : float, default=1e-3
        Horizontal viewport division, in seconds

    Returns
    -------
    TextBlob
        Horizontal scale
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    scope.set_and_check(":HORIZONTAL:SCALE", scale)

    return TextBlob(text_blob="Horizontal scale")
