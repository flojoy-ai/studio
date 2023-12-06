from flojoy import flojoy, DataContainer, OrderedPair, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def EXTRACT_TRACE_MDO3XXX(
    connection: VisaConnection,
    channel: int = 0,
    x_length: int = 5000,
    length_type: Literal["pixels", "nanoseconds"] = "pixels",
    default: Optional[DataContainer] = None,
) -> OrderedPair:
    """Extract a trace from an MDO3xxx oscilloscope.

    The number of points in the x axis is defined by x_length and length_type
    parameters. A length_type of pixels and a x_length of 5000 will result in
    a trace with 5000 points. A length_type of nanoseconds instead results in
    a trace with a length of defined by the number of (nano)seconds.

    Requires a CONNECTION_MDO3XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible Tektronix scopes (untested):
    MDO4xxx, MSO4xxx, and DPO4xxx.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX block).
    x_length: int
        The length of the trace to extract.
    length_type: select
        The units of the length specified in x_length: nanoseconds or pixels.

    Returns
    -------
    DataContainer
        OrderedPair: The trace of the oscilloscope is returned.
    """

    tek = connection.get_handle()

    match length_type:
        case "pixels":
            tek.channel[0].set_trace_length(x_length)
        case "nanoseconds":
            tek.channel[0].set_trace_time(x_length / 1e9)

    x = tek.channel[channel].waveform.trace_axis()
    y = tek.channel[channel].waveform.trace()

    return OrderedPair(x=x, y=y)
