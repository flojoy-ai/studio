from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional


@flojoy(inject_connection=True)
def RESET_AFG31000(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
) -> String:
    """Reset the instrument.

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_AFG31000 block).

    Returns
    -------
    String
        Placeholder
    """

    afg = connection.get_handle()

    afg.write("*RST")

    return String(s="Reset channel parameters")
