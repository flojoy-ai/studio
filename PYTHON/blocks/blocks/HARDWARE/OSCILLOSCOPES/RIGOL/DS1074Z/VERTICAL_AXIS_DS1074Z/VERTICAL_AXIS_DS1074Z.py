from flojoy import flojoy, DataContainer, TextBlob, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def VERTICAL_AXIS_DS1074Z(
    connection: VisaConnection,
    query_set: Literal["query", "set"] = "query",
    channel: Literal["ch1", "ch2", "ch3", "ch4"] = "ch1",
    offset: float = 0,
    scale: float = 1e-3,
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """Change the vertical axis display for the DS1074Z oscilloscope.

    Both the scale and offset can be changed. The scale sets the size
    of one section. The full window is 12 times the scale. The offset and scale
    setting will be rounded up to the nearest available setting by the DS1074Z.

    If 'query_set' is set to query the trigger settings will be queried and
    left unchanged.

    Requires a CONNECTION_DS1074Z block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_DS1074Z block).
    query_set: select:
        "query" or "set" the trigger settings.
    channel: select
        Which channel to set or query.
    offset: float
        Set the vertical axis offset.
    scale: float
        Set the vertical axis scale.

    Returns
    -------
    TextBlob
        Summary of the vertical axis settings.
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
            unit = rigol.ask_raw(f":{channel}:UNITs?")

            s = "Offset: "
            s += str(rigol.ask_raw(f":{channel}:OFFSet?"))
            s += f"{unit}; "

            s += "Scale: "
            s += str(rigol.ask_raw(f":{channel}:SCALe?"))
            s += unit

        case "set":
            rigol.write_raw(f":{channel}:SCALe {scale}")
            rigol.write_raw(f":{channel}:OFFSet {offset}")
            unit = rigol.ask_raw(f":{channel}:UNITs?")

            s = "Offset: "
            s += str(offset)
            s += f"{unit}; "

            s += "Scale: "
            s += str(scale)
            s += unit

    return TextBlob(text_blob=s)
