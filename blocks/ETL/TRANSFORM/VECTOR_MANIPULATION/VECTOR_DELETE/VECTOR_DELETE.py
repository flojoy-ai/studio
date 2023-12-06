from numpy import any, array, delete, arange
from flojoy import flojoy, Vector, Array


@flojoy
def VECTOR_DELETE(default: Vector, indices: Array, length: int = 1) -> Vector:
    """The VECTOR_DELETE node returns a new Vector with elements deleted from requested indices

    Inputs
    ------
    v : Vector
        The input vector to delete from

    Parameters
    ----------
    indices: Array
        specified indices to delete value(s) at from the input vector

    length: int
        number of elements to delete from the input vector, default is 1 (this only applies when one index is specified for indices parameter)

    Returns
    -------
    Vector
        The new vector with element(s) deleted from the input vector
    """

    # unwrap the indices first
    indices = array(indices.unwrap(), dtype=int)

    assert len(default.v) > len(
        indices
    ), "The length of indices parameter must be less than the length of the Vector."
    assert any(indices >= 0), "The indices must be greater than zero."

    if len(indices) == 1:
        assert (
            (indices[0] + (length - 1)) < len(default.v)
        ), "The length of items to delete starting from index parameter must not exceed the length of the Vector."

    if len(indices) > 1:
        v = delete(default.v, indices, None)
    else:
        indices = arange(indices[0], length)
        v = delete(default.v, indices, None)
    return Vector(v=v)
