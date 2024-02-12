from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional


@flojoy(inject_connection=True)
def CLEAR_BUFFER_33120A(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
) -> String:
    """Clear the buffer for a 33120A function generator.

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

    write = "*CLS\n"
    instru.write(write.encode())

    return String(s="Buffer Cleared")
