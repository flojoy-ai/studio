from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional


@flojoy(inject_connection=True)
def RESET_33120A(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
) -> String:
    """Resets a 33120A function generator to it's default state.

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).

    Returns
    -------
    DataContainer
        String: Summary of waveform generator settings.
    """

    instru = connection.get_handle()

    write = "*RST\n"

    instru.write(write.encode())

    return String(s="Reset")
