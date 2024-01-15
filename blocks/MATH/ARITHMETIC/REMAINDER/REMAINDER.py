import numpy as np
from flojoy import flojoy, OrderedPair, Scalar, Vector
from blocks.MATH.ARITHMETIC.utils.arithmetic_utils import get_val
from functools import reduce


@flojoy
def REMAINDER(
    a: OrderedPair | Scalar | Vector, b: list[OrderedPair | Scalar | Vector]
) -> OrderedPair | Scalar | Vector:
    """Find the remainder (division) of two numeric arrays, matrices, dataframes, or constants element-wise.

    When a constant is divided into an array or matrix, each element in the array or matrix will be divided by the constant value.

    Parameters
    ----------
    a : OrderedPair|Scalar|Vector
        The input that will be divided by b.
    b : OrderedPair|Scalar|Vector
        The input that will divide a.

    Returns
    -------
    OrderedPair|Scalar|Vector
        OrderedPair if a is an OrderedPair.
        x: the x-axis of input a.
        y: the remainder of input a by input b.

        Scalar if a is a Scalar.
        c: the remainder of input a by input b.

        Vector if a is a Vector.
        v: the remainder of input a by input b.
    """

    initial = get_val(a)
    seq = map(lambda dc: get_val(dc), b)
    y2 = reduce(lambda u, v: np.remainder(u, v), seq, initial)

    match a:
        case OrderedPair():
            return OrderedPair(x=a.x, y=y2)
        case Vector():
            return Vector(v=y2)
        case Scalar():
            return Scalar(c=y2)
