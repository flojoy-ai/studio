from flojoy import flojoy, DataContainer, TextBlob, VisaConnection
from typing import Optional


@flojoy(inject_connection=True)
def DISPLAY_FSV(
    connection: VisaConnection,
    display_on: bool = False,
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """The DISPLAY_FSV block turns the display on or off during remote control.

    The instrument may be faster with display_on = False.

    Requires a CONNECTION_FSV node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible R&S network analyzers.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_FSV node).
    display_on: float
        Keep the display on? The FSV runs faster when off.

    Returns
    -------
    TextBlob
        Display on or off.
    """

    rohde = connection.get_handle()

    if display_on:
        rohde.write("SYST:DISP:UPD ON")
        s = "Display: ON"
    else:
        rohde.write("SYST:DISP:UPD OFF")
        s = "Display: OFF"

    return TextBlob(text_blob=s)
