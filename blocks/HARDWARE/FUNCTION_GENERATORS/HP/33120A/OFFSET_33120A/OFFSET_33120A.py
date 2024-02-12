from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def OFFSET_33120A(
    connection: SerialConnection,
    offset: float = 0,
    options: Literal["min", "max", "input"] = "input",
    default: Optional[DataContainer] = None,
) -> String:
    """Set the output voltage offset for a 33120A function generator.

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).
    offset: float
        The offset of the output waveform, in volts.
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
            instru.write(f"VOLT:OFFS {offset}\n".encode("utf-8"))
        case "max":
            instru.write("VOLT:OFFS max\n".encode("utf-8"))
        case "min":
            instru.write("VOLT:OFFS min\n".encode("utf-8"))

    return String(s=f"{offset}")
