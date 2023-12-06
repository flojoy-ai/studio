from flojoy import flojoy, DataContainer, TextBlob, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def INIT_SWEEP_FSV(
    connection: VisaConnection,
    display: Literal[
        "write",
        "view",
        "average",
        "maxhold",
        "minhold",
        "blank",
    ] = "write",
    continuous: bool = True,
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """Start the sweep for the FSV.

    Requires a CONNECTION_FSV block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible R&S network analyzers.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_FSV block).
    display: select
        Choose the trace display setting.
    continuous: bool
        Sweep continuously or not.

    Returns
    -------
    TextBlob
        Display and sweep settings.
    """

    rohde = connection.get_handle()

    rohde.write(f"DISP:TRAC:MODE {display}")
    if continuous:
        rohde.write("INIT:CONT ON")
    else:
        rohde.write("INIT:CONT OFF")
    rohde.write("INIT")

    return TextBlob(text_blob=f"Display: {display}, Continuous: {continuous}")
