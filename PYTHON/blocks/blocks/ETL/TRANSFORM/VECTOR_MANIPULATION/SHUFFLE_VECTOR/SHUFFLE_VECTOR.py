from numpy.random import permutation
from flojoy import flojoy, Vector


@flojoy
def SHUFFLE_VECTOR(
    default: Vector,
) -> Vector:
    """The SHUFFLE_VECTOR node returns a vector that is randomly shuffled.

    Parameters
    ----------
    default : Vector
        The vector to shuffle.

    Returns
    -------
    Vector
        Shuffled input vector
    """

    shuffledVector = permutation(default.v)

    return Vector(v=shuffledVector)
