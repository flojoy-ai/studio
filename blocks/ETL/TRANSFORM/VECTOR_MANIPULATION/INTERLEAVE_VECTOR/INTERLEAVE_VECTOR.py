from numpy import stack
from flojoy import flojoy, Vector


@flojoy
def INTERLEAVE_VECTOR(
    default: Vector,
    a: list[Vector],
) -> Vector:
    """The INTERLEAVE_VECTOR node combine multiple vectors into a single vector type by interleaving their elements.

    Parameters
    ----------
    default : Vector
        The input vector

    Returns
    -------
    Vector
        Interleaved vector
    """
    interleavedVectors = [default.v]

    for i in range(len(a)):
        interleavedVectors = interleavedVectors + [a[i].v]

    interleavedVector = stack(interleavedVectors)
    interleavedVector = interleavedVector.T.flatten()

    return Vector(v=interleavedVector)
