from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, TextBlob


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def HORIZONTAL_POSITION_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    delay: float = 0,
    position: float = 50,
) -> TextBlob:
    """Set the MSO2X oscilloscope horizontal position or delay.

    If delay is non-zero, position is unused.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    delay : float, default=0
        Delay after trigger, in seconds. Delay mode is turned on if not 0.
    position : float, default=50
        Horizontal position, in percent. Only used if delay is zero.

    Returns
    -------
    TextBlob
        Horizontal position
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    scope.commands.horizontal.delay.mode.write(delay)
    scope.commands.horizontal.position.write(position)

    return TextBlob(text_blob="Horizontal position")
