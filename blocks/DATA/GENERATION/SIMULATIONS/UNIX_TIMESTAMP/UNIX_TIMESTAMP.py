import time
import datetime
from flojoy import flojoy, Scalar, Vector, OrderedPair
from typing import Optional, Literal


@flojoy
def UNIX_TIMESTAMP(
    default: Optional[Scalar] = None,
    dc_type: Literal["Scalar", "Vector"] = "Scalar",
) -> Scalar | Vector | OrderedPair:
    """Return the current UNIX timestamp as a float (Scalar) or array (Vector) with length equal to 1.

    If a Scalar input is provided, the Scalar is returned with the timestamp as an OrderedPair.

    Inputs
    ------
    default : Scalar
        A value to timestamp

    Parameters
    ----------
    dc_type : select
        The type of DataContainer to return.

    Returns
    -------
    Scalar|Vector|OrderedPair
    """

    unix_timestamp = time.mktime(datetime.datetime.now().timetuple())

    if default is not None:
        return OrderedPair(x=[unix_timestamp], y=[default.c])

    match dc_type:
        case "Scalar":
            return Scalar(c=unix_timestamp)
        case "Vector":
            return Vector(v=[unix_timestamp])
