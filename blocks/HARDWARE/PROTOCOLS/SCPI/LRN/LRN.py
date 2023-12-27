from typing import Optional
from flojoy import VisaConnection, flojoy, String, DataContainer


@flojoy(inject_connection=True)
def LRN(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
) -> String:
    """Sends the *LRN? command to the selected VISA device.

    Requires a connection block used first in the flowchart.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires a connection block).

    Returns
    -------
    String
        Available SCPI commands
    """

    # Retrieve oscilloscope instrument connection.
    instr = connection.get_handle()
    commands = instr.query("*LRN?")

    return String(s=str(commands))
