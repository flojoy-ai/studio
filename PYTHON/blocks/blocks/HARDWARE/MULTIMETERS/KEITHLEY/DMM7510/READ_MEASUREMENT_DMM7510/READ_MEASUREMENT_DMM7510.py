from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, Scalar


@flojoy(inject_connection=True)
def READ_MEASUREMENT_DMM7510(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
) -> Scalar:
    """Reads a single measurement from the DMM7510.

    Requires a CONNECT_DMM7510 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_DMM7510 block).

    Returns
    -------
    Scalar
        Measurement
    """

    dmm = connection.get_handle()

    c = float(dmm.commands.dmm.measure.read())

    return Scalar(c=c)
