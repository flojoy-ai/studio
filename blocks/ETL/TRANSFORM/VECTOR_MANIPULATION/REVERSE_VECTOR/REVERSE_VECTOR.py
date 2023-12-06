from numpy import flip
from flojoy import flojoy, Vector


@flojoy
def REVERSE_VECTOR(
    default: Vector,
) -> Vector:
    """The REVERSE_VECTOR node returns a vector equal to the input vector but reversed.

    Parameters
    ----------
    default : Vector
        The input vector.

    Returns
    -------
    Vector
        Reversed input vector.
    """

    return Vector(v=flip(default.v))
