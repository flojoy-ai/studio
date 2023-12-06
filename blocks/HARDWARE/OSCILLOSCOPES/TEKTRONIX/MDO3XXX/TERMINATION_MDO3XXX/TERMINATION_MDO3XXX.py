from flojoy import flojoy, DataContainer, Scalar, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def TERMINATION_MDO3XXX(
    connection: VisaConnection,
    channel: int = 0,
    termination: Literal["50 ohm", "75 ohm", "1M ohm"] = "50 ohm",
    query_set: Literal["query", "set"] = "query",
    default: Optional[DataContainer] = None,
) -> Scalar:
    """The TERMINATION_MDO3XXX block sets the termination ohms (or queries it).

    The termination is set by the output, and the set termination
    in the oscilloscope must match that value.

    Note that the termination is often called the "electrical impedance".
    Note that the 75 Ohm option is not compatible with all model numbers.

    If the "VISA_address" parameter is not specified the VISA_index will be
    used to find the address. The LIST_VISA block can be used to show the
    indicies of all available VISA instruments.

    This block should also work with compatible Tektronix scopes (untested):
    MDO4xxx, MSO4xxx, and DPO4xxx.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX block).
    channel: int
        The channel to query or set the impedance/termination.
    termination: str
        The ohm to which the termination impedance is set to.
    query_set: str
        Whether to query or set the triggering voltage.

    Returns
    -------
    DataContainer
        Scalar: The termination value for the chosen channel.
    """

    tek = connection.get_handle()

    match termination:
        case "50 ohm":
            termination = 50
        case "75 ohm":
            termination = 75  # Not compatible with all instruments.
        case "1M ohm":
            termination = 1e6

    match query_set:
        case "query":
            c = tek.channel[int(channel)].termination()
        case "set":
            tek.channel[int(channel)].termination(termination)
            c = termination

    return Scalar(c=c)
