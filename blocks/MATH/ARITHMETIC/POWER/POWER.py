import numpy as np
from flojoy import OrderedPair, flojoy, Scalar, Vector
from blocks.MATH.ARITHMETIC.utils.arithmetic_utils import get_val
from functools import reduce


@flojoy
def POWER(
    a: OrderedPair | Scalar | Vector, b: list[OrderedPair | Scalar | Vector]
) -> OrderedPair | Scalar | Vector:
    """Calculate the power of two numeric arrays, vectors, matrices, or constants element-wise.

    Parameters
    ----------
    a : OrderedPair|Scalar|Vector
        The input a used to compute a to the power of b.
    b : OrderedPair|Scalar|Vector
        The input b used to compute a to the power of b.

    Returns
    -------
    OrderedPair|Scalar|Vector
        OrderedPair if a is an OrderedPair.
        x: the x-axis of input a.
        y: the result of a^b (or a**b).

        Scalar if a is a Scalar.
        c: the result of a^b (or a**b).

        Vector if a is a Vector.
        v: the result of a^b (or a**b).
    """

    initial = get_val(a)
    seq = map(lambda dc: get_val(dc), b)
    y = reduce(lambda u, v: np.power(u, v), seq, initial)

    match a:
        case OrderedPair():
            return OrderedPair(x=a.x, y=y)
        case Vector():
            return Vector(v=y)
        case Scalar():
            return Scalar(c=y)
