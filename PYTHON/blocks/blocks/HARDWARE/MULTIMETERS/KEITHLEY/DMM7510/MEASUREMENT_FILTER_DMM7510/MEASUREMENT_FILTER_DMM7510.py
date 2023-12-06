from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, TextBlob


@flojoy(inject_connection=True)
def MEASUREMENT_FILTER_DMM7510(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    on_off: Literal["on", "off"] = "off",
    avg_type: Literal["moving", "repeat"] = "moving",
    count: int = 10,
    window: float = 0,
) -> TextBlob:
    """Changes the measurement filter settings for the DMM7510.

    Requires a CONNECT_DMM7510 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_DMM7510 block).
    on_off : select, default=off
        Turn the filter on or off.
    avg_type : select, default=moving
        Use moving or repeating averaging.
    count : int, default=10
        The number of counts to average.
    window : float, default=0
        The size of the window, in percent.

    Returns
    -------
    TextBlob
        Filter settings
    """
    assert 0.0 <= window <= 100.0, "The window must be between 0 and 100."
    assert count > 1, "The count must be greater than 1."

    dmm = connection.get_handle()

    if avg_type == "moving":
        dmm.commands.dmm.measure.filter.type = "dmm.FILTER_MOVING_AVG"
    else:
        dmm.commands.dmm.measure.filter.type = "dmm.FILTER_REPEAT_AVG"

    dmm.commands.dmm.measure.filter.count = count
    dmm.commands.dmm.measure.filter.window = window

    match on_off:
        case "off":
            dmm.commands.dmm.measure.filter.enable = "dmm.OFF"
        case "on":
            dmm.commands.dmm.measure.filter.enable = "dmm.ON"

    return TextBlob(text_blob=f"Filter {on_off}")
