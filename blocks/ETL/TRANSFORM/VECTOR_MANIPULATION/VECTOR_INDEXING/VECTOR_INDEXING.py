from flojoy import flojoy, Vector, Scalar


@flojoy
def VECTOR_INDEXING(
    default: Vector,
    index: int = 0,
) -> Scalar:
    """The VECTOR_INDEXING node returns the value of the vector at the requested index.

    Inputs
    ------
    v : vector
        The input vector to index.

    Parameters
    ----------
    index : int
        The index of the vector to return.

    Returns
    -------
    Scalar
        The scalar index of the input vector.
    """

    assert (
        len(default.v) > index
    ), "The index parameter must be less than the length of the Vector."
    assert index >= 0, "The index parameter must be greater than zero."
    c = default.v[index]

    return Scalar(c=c)
