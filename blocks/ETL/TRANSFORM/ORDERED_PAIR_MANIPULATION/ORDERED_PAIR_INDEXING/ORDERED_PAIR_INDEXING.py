from flojoy import flojoy, OrderedPair, Scalar


@flojoy
def ORDERED_PAIR_INDEXING(
    default: OrderedPair,
    index: int = 0,
    x_axis: bool = False,
) -> Scalar:
    """Returns the value of the OrderedPair at the requested index.

    Parameters
    ----------
    default : OrderedPair
        The input OrderedPair to index.
    index : int
        The index of the OrderedPair to return.
    x_axis : bool
        Index x axis? If not y is indexed.

    Returns
    -------
    Scalar
        The scalar index of the input OrderedPair.
    """

    assert (
        len(default.x) > index
    ), "The index parameter must be less than the length of the OrderedPair."
    assert index >= 0, "The index parameter must be greater than zero."

    if x_axis:
        c = default.x[index]
    else:
        c = default.y[index]

    return Scalar(c=c)
