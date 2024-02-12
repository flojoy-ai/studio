from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def AMPLITUDE_33120A(
    connection: SerialConnection,
    amplitude: float = 0.1,
    options: Literal["min", "max", "input"] = "input",
    default: Optional[DataContainer] = None,
) -> String:
    """Set the output amplitude for a 33120A function generator.

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).
    function: float
        The amplitude of the output waveform.
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
            instru.write(f"VOLT {amplitude}\n".encode("utf-8"))
        case "max":
            instru.write("VOLT max\n".encode("utf-8"))
        case "min":
            instru.write("VOLT min\n".encode("utf-8"))

    return String(s=f"{amplitude}")
