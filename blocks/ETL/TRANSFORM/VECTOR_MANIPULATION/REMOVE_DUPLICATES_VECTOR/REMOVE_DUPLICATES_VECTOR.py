from numpy import unique
from flojoy import flojoy, Vector


@flojoy
def REMOVE_DUPLICATES_VECTOR(
    default: Vector,
) -> Vector:
    """The REMOVE_DUPLICATES_VECTOR node returns a vector with only unique elements.

    Parameters
    ----------
    default : Vector
        The input vector

    Returns
    -------
    Vector
        Unique input vector
    """

    return Vector(v=unique(default.v))
