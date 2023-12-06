from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def ALIGN_PHASES_AFG31000(
    connection: VisaConnection,
    channel: Literal["1", "2"] = "1",
    input: Optional[DataContainer] = None,
) -> String:
    """Run this block to align the phases for ch1 and ch2.

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_AFG31000 block).
    channel: select, default=ch1
        Which channel is the reference?

    Returns
    -------
    String
        Aligned channel phases
    """

    afg = connection.get_handle()

    afg.write(f"SOURCE{channel}:PHASE:INIT")

    return String(s="Aligned channel phases")
