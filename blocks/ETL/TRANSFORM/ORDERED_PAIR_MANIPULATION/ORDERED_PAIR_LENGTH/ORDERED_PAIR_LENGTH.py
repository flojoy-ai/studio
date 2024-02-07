from flojoy import flojoy, OrderedPair, Scalar


@flojoy
def ORDERED_PAIR_LENGTH(default: OrderedPair) -> Scalar:
    """Returns the length of the input OrderedPair.

    Parameters
    ----------
    default : OrderedPair
        The input OrderedPair to find the length of.

    Returns
    -------
    Scalar
        The length of the input OrderedPair.
    """

    return Scalar(c=len(default.x))
