from typing import Optional
from flojoy import VisaConnection, flojoy, Vector, DataContainer
import numpy as np


@flojoy(deps={"tm_devices": "0.1.24"}, inject_connection=True)
def QUERY_CURVE_MSO(
    connection: VisaConnection,
    default: Optional[DataContainer] = None,
    channel: int = 1,
) -> Vector:
    """Run a SCPI curve query on a MSO2XX oscilloscope.

    Parameters
    ----------
    channel : int
        Oscilloscope channel to query (eg 1 or 2 for a 2 channel scope)

    Returns
    -------
    Vector
        A list containing the curve query results.
    """

    # Retrieve oscilloscope instrument connection
    dm, scope = connection.get_handle()

    curve = scope.curve_query(channel)

    return Vector(v=np.array(curve))
