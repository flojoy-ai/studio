import numpy as np
from flojoy import flojoy, Vector, OrderedPair
from typing import Optional


@flojoy
def LINSPACE(
    default: Optional[OrderedPair | Vector] = None,
    start: float = 10,
    end: float = 0,
    step: int = 1000,
) -> Vector:
    """Generate a Vector of evenly spaced data between two points.

    This block uses the 'linspace' numpy function. It is useful for generating an x-axis for the OrderedPair data type.

    Inputs
    ------
    default : OrderedPair
        Optional input in case LINSPACE is used in a loop. Not used.

    Parameters
    ----------
    start : float
        The start point of the data.
    end : float
        The end point of the data.
    step : float
        The number of points in the vector.

    Returns
    -------
    Vector
        v: the vector between 'start' and 'end' with a 'step' number of points.
    """

    v = np.linspace(start, end, step)
    return Vector(v=v)
