from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, Scalar


@flojoy(deps={"tm_devices": "1.0"}, inject_connection=True)
def MEASURE_READ_2450(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
) -> Scalar:
    """Returns the measurement reading from the 2450.

    Use the MEASURE_SETTINGS_2450 block to change the measurement settings.

    Requires a CONNECT_2450 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_2450 block).

    Returns
    -------
    Scalar
        Reading
    """

    # Retrieve oscilloscope instrument connection
    smu = connection.get_handle()

    c = float(smu.commands.smu.measure.read())

    return Scalar(c=c)
