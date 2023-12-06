from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, TextBlob


@flojoy(inject_connection=True)
def RESET_2450(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
) -> TextBlob:
    """Resets the 2450 and clears buffers.

    Requires a CONNECT_2450 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_2450 block).

    Returns
    -------
    TextBlob
        Reset
    """

    smu = connection.get_handle()
    smu.commands.reset()

    return TextBlob(text_blob="Reset 2450")
