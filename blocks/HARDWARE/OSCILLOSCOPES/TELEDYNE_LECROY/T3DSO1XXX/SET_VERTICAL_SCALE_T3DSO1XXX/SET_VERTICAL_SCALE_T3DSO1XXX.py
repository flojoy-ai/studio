from flojoy import flojoy, DataContainer, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def SET_VERTICAL_SCALE_T3DSO1XXX(
    connection: VisaConnection,
    channel: Literal["C1", "C2", "C3", "C4"] = "C1",
    volt_gain: float = 1.000,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Sets the vertical sensitivity in Volts/div of an T3DSO1000(A)-2000 oscilloscope.

    Requires a CONNECT_T3DSO1XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should work with any Teledyne LeCroy T3DSO1000(A)-2000 series oscilloscope.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECT_T3DSO1XXX block).
    channel: select
        The channel to set the vertical sensitivity for.
    volt_gain: float
        The vertical sensitivity in Volts (0.0005V to 10V).
    default: DataContainer
        The input data container.

    Returns
    -------
    DataContainer
        None
    """
    assert (
        volt_gain >= 0.0005 and volt_gain <= 10
    ), f"Invalid volt_gain {volt_gain}, must be between 0.0005V and 10V"

    scope = connection.get_handle()
    scope.write(f"{channel}:VOLT_DIV {volt_gain}")

    return None
