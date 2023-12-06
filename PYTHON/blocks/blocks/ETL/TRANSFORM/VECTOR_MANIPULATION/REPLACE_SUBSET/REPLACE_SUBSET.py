from numpy import any, array, arange, put
from flojoy import flojoy, Vector, Array


@flojoy
def REPLACE_SUBSET(
    default: Vector, indices: Array, values: Array, length: int = 1
) -> Vector:
    """The REPLACE_SUBSET node returns a new Vector with subset of elements replaced.

    Inputs
    ------
    v : Vector
        The input vector to replace subset from

    Parameters
    ----------
    indices: Array
        specified indices to replace values at from the input vector

    values: Array
        subset of values to replace the specified indices

    length: int
        number of elements to replace from the input vector, default is 1 (this only applies when one index is specified for indices parameter)

    Returns
    -------
    Vector
        The new vector with subset of elements replaced from the input vector
    """

    # unwrap the indices first
    indices = array(indices.unwrap(), dtype=int)
    # unwrap the values next
    values = array(values.unwrap(), dtype=int)

    assert len(default.v) > len(
        indices
    ), "The length of indices parameter must be less than the length of the Vector."
    assert any(indices >= 0), "The indices must be greater than zero."

    if len(indices) == 1:
        assert (
            (indices[0] + (length - 1)) < len(default.v)
        ), "The length of items to delete starting from index parameter must not exceed the length of the Vector."

    if len(indices) > 1:
        assert (
            len(indices) == len(values)
        ), "The number of indices and the number of correpsonding elements must be equal."
        put(default.v, indices, values)
    else:
        assert (
            length == len(values)
        ), "The number of indices and the number of correpsonding elements must be equal."
        indices = arange(indices[0], length)
        put(default.v, indices, values)
    return Vector(v=default.v)
