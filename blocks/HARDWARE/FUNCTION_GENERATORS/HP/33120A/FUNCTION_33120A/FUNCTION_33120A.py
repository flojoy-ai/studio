from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def FUNCTION_33120A(
    connection: SerialConnection,
    waveform: Literal["sin", "square", "triangle", "ramp", "noise", "DC"] = "sin",
    default: Optional[DataContainer] = None,
) -> String:
    """Select the output function for a 33120A function generator.

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).
    waveform: select
        The type of function to use.

    Returns
    -------
    DataContainer
        String: Summary of waveform generator settings.
    """

    instru = connection.get_handle()

    instru.write(f"FUNC {waveform}\n".encode("utf-8"))

    return String(s=f"{waveform}")
