from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional


@flojoy(inject_connection=True)
def SINGLE_TRIGGER_DS1047Z(
    connection: VisaConnection,
    single: bool = True,
    default: Optional[DataContainer] = None,
) -> String:
    """Activates the single trigger mode.

    The oscilloscope will wait for a trigger and then stop aquiring.
    Set the `single` parameter to False to turn back on normal triggering.

    Requires a CONNECTION_DS1074Z node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    None

    Returns
    -------
    DataContainer
        String: summary of channel settings.
    """

    rigol = connection.get_handle()

    if single:
        rigol.write_raw(":SINGle")
        s = "Single trigger"
    else:
        rigol.write_raw(":TRIG:SWE NORM")
        s = "Normal trigger"

    return String(s=s)
