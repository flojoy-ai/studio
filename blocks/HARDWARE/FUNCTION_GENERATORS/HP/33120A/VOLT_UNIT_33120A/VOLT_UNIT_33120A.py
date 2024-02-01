from flojoy import flojoy, DataContainer, String, SerialConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def VOLT_UNIT_33120A(
    connection: SerialConnection,
    unit: Literal["VPP", "VRMS", "DBM", "default"] = "default",
    default: Optional[DataContainer] = None,
) -> String:
    """Choose the amplutide unit a 33120A function generator.

    Affects the amplitude (AMPLUTIDE 33120A) but not the voltage
    offset (OFFSET 33120A).

    Requires an OPEN SERIAL block at the start of the app to connect with
    the instrument.

    Parameters
    ----------
    connection: SerialConnection
        The VISA address (requires a OPEN SERIAL node).
    state: select
        The state to save.

    Returns
    -------
    DataContainer
        String: Summary of waveform generator settings.
    """

    instru = connection.get_handle()

    if unit == "default":
        unit = "DEF"
    write = f"VOLT:UNIT {unit}\n".encode()
    instru.write(write)

    return String(s=f"{unit}")
