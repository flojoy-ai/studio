from numpy import concatenate
from flojoy import flojoy, Vector


@flojoy
def VECTOR_INSERT(default: Vector, index: int = 0, value: int = 0) -> Vector:
    """The VECTOR_INSERT node inserts a value to the Vector at the
    specified index.

    Inputs
    ------
    v : Vector
        The input vector to insert value.

    Parameters
    ----------
    element: int
        The value to add to the input vector.

    index: int
        The index of the vector to insert value.

    Returns
    -------
    Vector
        The new vector that contains the inserted value
    """

    assert (
        len(default.v) > index
    ), "The index parameter must be less than the length of the Vector."
    assert index >= 0, "The index parameter must be greater than zero."

    if index == len(default.v) - 1:
        v = concatenate((default.v, [value]))
    else:
        v = concatenate((default.v[:index], [value], default.v[index:]))

    return Vector(v=v)
