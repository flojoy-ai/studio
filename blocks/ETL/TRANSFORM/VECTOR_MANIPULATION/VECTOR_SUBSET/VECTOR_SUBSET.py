from numpy import any, array, arange, take
from flojoy import flojoy, Vector, Array


@flojoy
def VECTOR_SUBSET(default: Vector, indices: Array, length: int = 1) -> Vector:
    """The VECTOR_SUBSET node returns the subset of values from requested indices
    Inputs
    ------
    v : Vector
        The input vector to return subset of values from

    Parameters
    ----------
    indices: Array
        specified indices to extract values at from the input vector

    length: int
        number of elements to extract from the input vector, default is 1 (this only applies when one index is specified for indices parameter)

    Returns
    -------
    Vector
        The new vector with subset of elements extracted from the input vector
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
        v = take(default.v, indices)
    else:
        indices = arange(indices[0], length)
        v = take(default.v, indices)
    return Vector(v=v)
