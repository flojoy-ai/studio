from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def TRIGGER_33120A(
    connection: SerialConnection,
    source: Literal["immediate", "external", "bus"] = "immediate",
    slope: Literal["positive", "negative"] = "positive",
    default: Optional[DataContainer] = None,
) -> String:
    """Chose the trigger source and slope for a 33120A function generator.

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).
    source: select
        The source to use for triggering.
    slope: select
        Trigger on positive or negative slopes.

    Returns
    -------
    DataContainer
        String: Summary of waveform generator settings.
    """

    instru = connection.get_handle()

    instru.write(f"TRIG:SOUR {source}\n".encode("utf-8"))
    instru.write(f"TRIG:SLOP {slope}\n".encode("utf-8"))

    return String(s=f"{source} {slope}")
