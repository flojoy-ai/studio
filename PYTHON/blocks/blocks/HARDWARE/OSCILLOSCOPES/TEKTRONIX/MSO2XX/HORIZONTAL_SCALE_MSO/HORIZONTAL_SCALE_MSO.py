from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer


@flojoy(deps={"tm_devices": "0.1.24"}, inject_connection=True)
def HORIZONTAL_SCALE_MSO(
    connection: VisaConnection,
    default: Optional[DataContainer] = None,
    scale: float = 1e-3,
) -> None:
    """Set the MSO2XX oscilloscope viewport.

    Parameters
    ----------
    scale : float
        Horizontal viewport division

    Returns
    -------
    None
    """

    # Retrieve oscilloscope instrument connection
    dm, scope = connection.get_handle()

    scope.set_and_check(":HORIZONTAL:SCALE", scale)

    return None
