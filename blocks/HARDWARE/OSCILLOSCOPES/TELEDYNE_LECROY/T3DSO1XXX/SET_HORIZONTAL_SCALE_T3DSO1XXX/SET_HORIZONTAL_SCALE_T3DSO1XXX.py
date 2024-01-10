from flojoy import flojoy, DataContainer, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def SET_HORIZONTAL_SCALE_T3DSO1XXX(
    connection: VisaConnection,
    time_value: int = 500,
    time_unit: Literal["ns", "us", "ms", "s"] = "us",
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Sets the horizontal sensitivity in Volts/div of an T3DSO1000(A)-2000 oscilloscope.

    Sets the horizontal sensitivity in Volts/div. 

    Requires a CONNECT_T3DSO1XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should work with any Teledyne LeCroy T3DSO1000(A)-2000 series oscilloscope.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECT_T3DSO1XXX block).
    time_value: float
        The vertical sensitivity in Volts (0.0005V to 10V).
    time_unit: Literal
        The unit of the time value (ns: nanoseconds, us: microseconds, ms: milliseconds, s: seconds).
    default: DataContainer
        The input data container.

    Returns
    -------
    DataContainer
        None.
    """

    assert time_value > 0, f"Invalid time value {time_value}, must be greater than 0"

    scope = connection.get_handle()
    scope.write(f"TIME_DIV {time_value}{time_unit}")

    return None
