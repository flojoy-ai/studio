from numpy import roll
from flojoy import flojoy, Vector


@flojoy
def SHIFT_VECTOR(default: Vector, shift: int = 1) -> Vector:
    """The SHIFT_VECTOR node shifts the elements in the vector by the amount specified

    Inputs
    ------
    v : Vector
        The input vector to shift elements from

    Parameters
    ----------
    shift: int
        the number of places in which elements are moved (negative values will shift them to the left)

    Returns
    -------
    Vector
        The new vector with elements shifted
    """

    v = roll(default.v, shift)
    return Vector(v=v)
