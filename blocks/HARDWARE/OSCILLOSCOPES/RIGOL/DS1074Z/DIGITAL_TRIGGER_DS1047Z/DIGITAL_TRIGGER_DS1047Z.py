from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def DIGITAL_TRIGGER_DS1047Z(
    connection: VisaConnection,
    channel: int = 0,
    level: float = 0.1,
    slope: Literal["positive", "negative", "either", "unchanged"] = "positive",
    default: Optional[DataContainer] = None,
) -> String:
    """Sets the digital triggering channel and threshold level.

    Requires a CONNECTION_DS1074Z node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_DS1074Z node).
    channel: int
        Set the triggering channel, from 0-15.
    level: float
        The triggering level, in V.
    slope: select
        Which slope to detect the triggering time on.

    Returns
    -------
    DataContainer
        String: summary of channel settings.
    """

    rigol = connection.get_handle()

    assert 0 <= channel <= 15, "The channel must be between 0 and 15."

    rigol.write_raw(f":TRIG:EDGe:SOURce D{channel}")
    rigol.write_raw(f":TRIG:EDGe:LEVel {level}")

    if slope == "either":
        rigol.trigger_edge_slope("neither")
    elif slope != ("unchanged" or "either"):
        rigol.trigger_edge_slope(slope)

    s = f"Channel: {channel}; Level: {level}; Slope: {slope}"

    return String(s=s)
