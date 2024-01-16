from flojoy import flojoy, DataContainer, VisaConnection
from typing import Optional
from time import sleep


@flojoy(inject_connection=True)
def AUTO_SETUP_T3DSO1XXX(
    connection: VisaConnection,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Attempts to identify the waveform type automatically from an T3DSO1000(A)-2000 oscilloscope.

    Attempts to identify the waveform type and automatically adjusts controls to produce a usable display for the input signal.

    Requires a CONNECT_T3DSO1XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should work with any Teledyne LeCroy T3DSO1000(A)-2000 series oscilloscope.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECT_T3DSO1XXX block).

    Returns
    -------
    Optional[DataContainer]
        None.
    """

    scope = connection.get_handle()

    scope.write("ASET")
    sleep(2)

    return None
