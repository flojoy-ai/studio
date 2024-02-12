from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def FREQUENCY_33120A(
    connection: SerialConnection,
    frequency: float = 0.1,
    options: Literal["min", "max", "input"] = "input",
    default: Optional[DataContainer] = None,
) -> String:
    """Set the output frequency for a 33120A function generator.

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).
    frequency: float
        The frequency of the output waveform.
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
            write = f"FREQ {frequency}\n"
        case "max":
            write = "FREQ max\n"
        case "min":
            write = "FREQ min\n"

    instru.write(write.encode())

    return String(s=f"{frequency}")
