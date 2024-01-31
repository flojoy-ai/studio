from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional
from time import sleep


@flojoy(inject_connection=True)
def ERRORS_33120A(
    connection: SerialConnection,
    number: int = 1,
    prologix: bool = False,
    default: Optional[DataContainer] = None,
) -> String:
    """Return error messages from a 33120A function generator.

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).
    number: int
        The of errors to return.

    Returns
    -------
    DataContainer
        String: Summary of waveform generator settings.
    """

    instru = connection.get_handle()

    errors = "k"

    for i in range(number):
        write = "SYST:ERR?\n"
        instru.write(write.encode())
        if prologix:
            write = "++read eoi\n"
            instru.write(write.encode())

        s = instru.read(256)
        print("DEBUG: ", s, flush=True)
        if isinstance(s, bytes):
            s = s.decode("utf-8")
        errors += s
        errors += ", "
        sleep(0.5)

    return String(s=errors)  # [:-1])
