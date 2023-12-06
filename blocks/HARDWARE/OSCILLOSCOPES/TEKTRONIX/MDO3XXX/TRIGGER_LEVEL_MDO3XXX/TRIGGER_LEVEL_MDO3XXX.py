from flojoy import flojoy, DataContainer, Scalar, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def TRIGGER_LEVEL_MDO3XXX(
    connection: VisaConnection,
    trigger_volts: float = 0.1,
    query_set: Literal["query", "set"] = "query",
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Set the trigger voltage of a MDO3XXX oscilloscope (or queries it).

    The trigger voltage is the level at which an oscilloscope will find the
    start of a signal.

    Requires a CONNECTION_MDO3XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible Tektronix scopes (untested):
    MDO4xxx, MSO4xxx, and DPO4xxx.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX block).
    trigger_volts: float
        The voltage to set the triggering level to.
    query_set: str
        Whether to query or set the triggering voltage.

    Returns
    -------
    DataContainer
        Scalar: The triggering voltage.
    """

    tek = connection.get_handle()

    match query_set:
        case "query":
            volts = tek.trigger.level()
            c = volts
        case "set":
            tek.trigger.level(trigger_volts)
            c = trigger_volts

    return Scalar(c=c)
