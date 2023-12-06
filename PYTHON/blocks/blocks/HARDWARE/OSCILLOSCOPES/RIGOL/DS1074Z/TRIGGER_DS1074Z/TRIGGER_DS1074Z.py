from flojoy import flojoy, DataContainer, TextBlob, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def TRIGGER_DS1074Z(
    connection: VisaConnection,
    query_set: Literal["query", "set"] = "query",
    channel: Literal["ch1", "ch2", "ch3", "ch4"] = "ch1",
    level: float = 0.5,
    slope: Literal["positive", "negative", "either", "unchanged"] = "positive",
    coupling: Literal["AC", "DC", "LFReject", "HFReject", "unchanged"] = "DC",
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """Change the trigger settings for the DS1074Z oscilloscope.

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
        Which channel to use as the trigger channel.
    level: float
        Set the triggering level, in Volts
    slope: select
        Which slope to detect the triggering time on.
    coupling: select
        Which coupling to use for the trigger signal.

    Returns
    -------
    TextBlob
        The triggering settings.
    """

    rigol = connection.get_handle()

    match query_set:
        case "query":
            s = "Channel: "
            s += rigol.trigger_edge_source()

            s += "; Level: "
            s += rigol.trigger_level()
            s += "V ;"

            s += "; Slope: "
            s += rigol.trigger_edge_slope()

            s += "Coupling: "
            s += rigol.ask_raw(":TRIGger:COUPling?")

        case "set":
            rigol.trigger_edge_source(channel)
            rigol.trigger_level(level)

            if slope == "either":
                rigol.trigger_edge_slope("neither")
            elif slope != ("unchanged" or "either"):
                rigol.trigger_edge_slope(slope)

            if coupling != "unchanged":
                rigol.write_raw(f":TRIGger:COUPling {coupling}")

            s = "Channel: "
            s += channel

            s += "; Level: "
            s += str(level)
            s += "V ;"

            s += "; Slope: "
            s += slope

            s += "Coupling: "
            s += coupling

    return TextBlob(text_blob=s)
