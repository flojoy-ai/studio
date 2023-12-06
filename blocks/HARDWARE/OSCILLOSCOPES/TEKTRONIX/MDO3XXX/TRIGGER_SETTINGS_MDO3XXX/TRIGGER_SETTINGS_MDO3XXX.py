from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def TRIGGER_SETTINGS_MDO3XXX(
    connection: VisaConnection,
    query_set: Literal["query", "set"] = "query",
    edge_couplings: Literal[
        "unchanged", "ac", "dc", "hfrej", "lfrej", "noiserej"
    ] = "unchanged",
    trigger_types: Literal["unchanged", "edge", "logic", "pulse"] = "unchanged",
    edge_slope: Literal["unchanged", "rise", "fall", "either"] = "unchanged",
    default: Optional[DataContainer] = None,
) -> String:
    """Sets advanced trigger settings for an MDO3XXX oscilloscope.

    Note that "unchanged" will leave the settings unchanged.

    Requires a CONNECTION_MDO3XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible Tektronix scopes (untested):
    MDO4xxx, MSO4xxx, and DPO4xxx.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX block).
    query_set: str
        Whether to query or set the triggering channel.
    edge_couplings: str
        Set the trigger edge coupling type.
    trigger_types: str
        Set to trigger on edge, logic, or pulses.
    edge_slope: str
        Set to trigger on positive, negative, or either slopes.

    Returns
    -------
    DataContainer
        String: Summary of trigger settings.
    """

    tek = connection.get_handle()

    match query_set:
        case "query":
            edge_couplings = tek.trigger.edge_coupling()
            trigger_types = tek.trigger.type()
            edge_slope = tek.trigger.edge_slope()

        case "set":
            if edge_couplings != "unchanged":
                edge_couplings = tek.trigger.edge_coupling()
            if trigger_types != "unchanged":
                tek.trigger.type(trigger_types)
            if edge_slope != "unchanged":
                tek.trigger.edge_slope(edge_slope)

    s = str(
        f"Edge coupling: {edge_couplings},\n"
        f"Trigger type: {trigger_types},\n"
        f"Edge slope: {edge_slope}"
    )

    return String(s=s)
