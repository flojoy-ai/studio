from flojoy import flojoy, Vector, OrderedPair
from typing import TypedDict


class ResultSplit(TypedDict):
    x: Vector
    y: Vector


@flojoy
def ORDERED_PAIR_2_VECTOR(default: OrderedPair) -> ResultSplit:
    """Returns the split components (x, y) of an ordered pair as Vectors.

    Parameters
    ----------
    default : OrderedPair
        The input OrderedPair.

    Returns
    -------
    TypedDict:
        x: Vector from input x
        y: Vector from input y
    """

    return ResultSplit(x=Vector(v=default.x), y=Vector(v=default.y))
