from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def COPY_AFG31000(
    connection: VisaConnection,
    channel: Literal["ch1", "ch2"] = "ch1",
    input: Optional[DataContainer] = None,
) -> String:
    """Copy the setup parameters to the other channel.

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_AFG31000 block).
    channel: select, default=ch1
        Which channel to copy to the other channel.

    Returns
    -------
    String
        Placeholder
    """

    afg = connection.get_handle()

    if channel == "ch1":
        afg.write("AFGControl:CSCopy CH1,CH2")
    else:
        afg.write("AFGControl:CSCopy CH2,CH1")

    return String(s="Copied channel parameters")
