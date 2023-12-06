from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(inject_connection=True)
def RESET_DMM7510(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
) -> String:
    """Resets the DMM7510 and clears buffers.

    Requires a CONNECT_DMM7510 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_DMM7510 block).

    Returns
    -------
    String
        Reset
    """

    dmm = connection.get_handle()
    dmm.commands.reset()

    return String(s="Reset DMM7510")
