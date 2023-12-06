from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def TIME_AXIS_DS1074Z(
    connection: VisaConnection,
    query_set: Literal["query", "set"] = "query",
    offset: float = 0,
    scale: float = 1e-3,
    default: Optional[DataContainer] = None,
) -> String:
    """Change the time axis for the DS1074Z oscilloscope.

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
    offset: float
        Set the time axis offset, in seconds.
    scale: float
        Set the time axis scale, in seconds.

    Returns
    -------
    String
        summary of the time axis settings.
    """

    rigol = connection.get_handle()

    match query_set:
        case "query":
            s = "Offset: "
            s += str(rigol.ask_raw(":TIMebase:MAIN:OFFSet?"))
            s += "s; "

            s += "Scale: "
            s += str(rigol.ask_raw(":TIMebase:MAIN:SCALe?"))
            s += "s"

        case "set":
            rigol.write_raw(f":TIMebase:MAIN:SCALe {scale}")
            rigol.write_raw(f":TIMebase:MAIN:OFFSet {offset}")

            s = "Offset: "
            s += str(offset)
            s += "s; "

            s += "Scale: "
            s += str(scale)
            s += "s"

    return String(s=s)
