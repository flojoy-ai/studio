from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, String, DataContainer


@flojoy(inject_connection=True)
def SINGLE_TRIGGER_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
) -> String:
    """Sets the scope into single trigger mode.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).

    Returns
    -------
    String
        Trigger
    """

    # Retrieve oscilloscope instrument connection.
    scope = connection.get_handle()
    scope.write("FPAnel:PRESS SINGleseq")

    return String(s="Trigger once.")
