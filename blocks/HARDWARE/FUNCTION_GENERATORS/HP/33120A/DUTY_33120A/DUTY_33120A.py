from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def DUTY_33120A(
    connection: SerialConnection,
    duty: int = 50,
    options: Literal["min", "max", "input"] = "input",
    default: Optional[DataContainer] = None,
) -> String:
    """Set the square wave output duty for a 33120A function generator.

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).
    duty: int
        The duty for the square function, in percent.
    option: Literal
        Use the input value, or set to the maximum or minimum.

    Returns
    -------
    DataContainer
        String: Summary of waveform generator settings.
    """

    instru = connection.get_handle()

    match options:
        case "input":
            write = f"PULS:DCYC {duty}\n".encode()
        case "max":
            write = "PULS:DCYC max\n".encode()
        case "min":
            write = "PULS:DCYC min\n".encode()

    instru.write(write)

    return String(s=f"{duty}")
