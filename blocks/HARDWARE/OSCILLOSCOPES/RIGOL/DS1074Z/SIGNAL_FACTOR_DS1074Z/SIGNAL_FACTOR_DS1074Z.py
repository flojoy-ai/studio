from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def SIGNAL_FACTOR_DS1074Z(
    connection: VisaConnection,
    query_set: Literal["query", "set"] = "query",
    channel: Literal["ch1", "ch2", "ch3", "ch4"] = "ch1",
    probe_factor: float = 1,
    default: Optional[DataContainer] = None,
) -> String:
    """Set the "probe" settings for the DS1074Z oscilloscope.

    Note that only select values are available. If the selected value isn't
    available, the instrument will default to 10.

    This setting multiplies the y axis of the selected channel by this factor.
    By default the setting is 10 on instrument startup. It is recommened to set
    it to 1 inside Flojoy, unless the probe requires a correction.

    Requires a CONNECTION_DS1074Z block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_DS1074Z block).
    query_set: select:
        "query" or "set" the setting.
    channel: select
        Which channel to use.
    probe_factor: float
        Multiply the y axis by this factor.

    Returns
    -------
    String
        The probe factor settings.
    """

    rigol = connection.get_handle()

    match channel:
        case "ch1":
            channel = "CHANnel1"
        case "ch2":
            channel = "CHANnel2"
        case "ch3":
            channel = "CHANnel3"
        case "ch4":
            channel = "CHANnel4"

    match query_set:
        case "query":
            s = rigol.ask_raw(f":{channel}:PROBe?")

        case "set":
            rigol.write_raw(f":{channel}:PROBe {probe_factor}")
            s = probe_factor

    return String(s=f"Probe factor: {s}")
