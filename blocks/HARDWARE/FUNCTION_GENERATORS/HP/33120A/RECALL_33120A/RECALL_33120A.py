from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def RECALL_33120A(
    connection: SerialConnection,
    state: Literal["0", "1", "2", "3"] = "1",
    default: Optional[DataContainer] = None,
) -> String:
    """Recalls the specified save state for a 33120A function generator.

    Note that the "0" state is the state saved when last powered down.

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).
    state: select
        The state to recall.

    Returns
    -------
    DataContainer
        String: Summary of waveform generator settings.
    """

    instru = connection.get_handle()

    instru.write(f"*RCL {state}\n".encode("utf-8"))

    return String(s=f"{state}")
