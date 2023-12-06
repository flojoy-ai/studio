from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer


@flojoy(deps={"tm_devices": "0.1.24"}, inject_connection=True)
def VERTICAL_SCALE_MSO(
    connection: VisaConnection,
    default: Optional[DataContainer] = None,
    channel: int = 1,
    scale: float = 1.0,
) -> None:
    """Set the MSO2XX oscilloscope viewport.

    Parameters
    ----------
    channel : int
        Oscilloscope channel to affect
    scale : float
        Vertical viewport division

    Returns
    -------
    None
    """

    # Retrieve oscilloscope instrument connection
    dm, scope = connection.get_handle()

    scope.set_and_check(":CH{0}:SCAL".format(str(channel)), scale)

    return None
