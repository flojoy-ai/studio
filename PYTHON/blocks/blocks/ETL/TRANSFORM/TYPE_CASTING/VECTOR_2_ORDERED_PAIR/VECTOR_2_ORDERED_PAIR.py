from flojoy import flojoy, Vector, OrderedPair


@flojoy
def VECTOR_2_ORDERED_PAIR(default: Vector, y: Vector) -> OrderedPair:
    """Convert a Vector DataContainer to an OrderedPair DataContainer.

    Parameters
    ----------
    default : Vector
        The input vector that will be the x axis of OrderedPair.
    y : Vector
        The input vector that will be the y axis of OrderedPair.

    Returns
    -------
    OrderedPair
        The OrderedPair that is generated from the input vectors
    """

    return OrderedPair(x=default.v, y=y.v)
