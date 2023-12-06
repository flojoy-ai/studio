from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, TextBlob


@flojoy(deps={"tm_devices": "1.0"}, inject_connection=True)
def BEEP_2450(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    duration: float = 0.25,
    frequency: float = 2000,
) -> TextBlob:
    """Causes the 2450 to beep audibly.

    Requires a CONNECT_2450 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_2450 block).
    duration : float, default=0.25
        The duration of the beep in seconds.
    frequency : float, default=2000
        The frequency, or tone, of the beep in Hz.

    Returns
    -------
    TextBlob
        Beep
    """

    # Retrieve oscilloscope instrument connection
    smu = connection.get_handle()

    smu.commands.beeper.beep(duration=duration, frequency=frequency)

    return TextBlob(text_blob="BEEP")
