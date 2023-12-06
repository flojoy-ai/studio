from flojoy import flojoy, Vector
from typing import TypedDict


class resultSplit(TypedDict):
    vector1: Vector
    vector2: Vector


@flojoy
def SPLIT_VECTOR(
    default: Vector,
    index: int = 0,
) -> resultSplit:
    """The SPLIT_VECTOR node returns a vector that is splited by a given index

    Inputs
    ------
    default : Vector
        The input vector

    Parameters
    ----------
    index : int
        index which you want to split your vector by

    Returns
    -------
    Vector
        Splited input vector
    """
    if index > len(default.v) - 1:
        raise ValueError(f"Given index is larger than the input vector, index: {index}")

    return resultSplit(
        vector1=Vector(default.v[:index]), vector2=Vector(default.v[index:])
    )
