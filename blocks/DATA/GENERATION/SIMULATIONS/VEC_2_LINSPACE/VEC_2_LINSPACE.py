import numpy as np
from flojoy import flojoy, Scalar, Vector


@flojoy
def VEC_2_LINSPACE(
    default: Scalar | Vector,
    start: float = -10,
    end: float = 10,
) -> Vector:
    """Generate a Vector of evenly spaced data between two points with a
    length equal to the input Vector length or Scalar.

    This block uses the 'linspace' numpy function. It is useful for
    generating an x-axis for the OrderedPair data type.

    Inputs
    ------
    default : Scalar | Vector
        Length of resulting linspace vector.

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

    if "v" in default:
        step = len(default.v)
    elif "c" in default:
        step = default.c

    v = np.linspace(start, end, step)
    return Vector(v=v)
