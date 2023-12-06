from flojoy import flojoy, Vector


@flojoy
def SORT_VECTOR(
    default: Vector,
    reverse: bool = False,
) -> Vector:
    """The SORT_VECTOR node returns the input Vector that is sorted

    Inputs
    ------
    default : Vector
        The input vector

    Parameters
    ----------
    reverse : bool
        If False, sort in ascending order. If True, descending order.

    Returns
    -------
    Vector
        Sorted input vector
    """
    return Vector(v=sorted(default.v, reverse=reverse))
