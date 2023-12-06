import numpy as np
from flojoy import OrderedPair, flojoy, Scalar, Vector
from blocks.MATH.ARITHMETIC.utils.arithmetic_utils import get_val
from functools import reduce


@flojoy
def MULTIPLY(
    a: OrderedPair | Scalar | Vector, b: list[OrderedPair | Scalar | Vector]
) -> OrderedPair | Scalar | Vector:
    """Multiply two numeric arrays, vectors, matrices, or constants element-wise.

    Parameters
    ----------
    a : OrderedPair|Scalar|Vector
        The input a use to compute the product of a and b.
    b : OrderedPair|Scalar|Vector
        The input b use to compute the product of a and b.

    Returns
    -------
    OrderedPair|Scalar|Vector
        OrderedPair if a is an OrderedPair.
        x: the x-axis of input a.
        y: the result of the product of input a and input b.

        Scalar if a is a Scalar.
        c: the result of the product of input a and input b.

        Vector if a is a Vector.
        v: the result of the product of input a and input b.
    """

    initial = get_val(a)
    seq = map(lambda dc: get_val(dc), b)
    y = reduce(lambda u, v: np.multiply(u, v), seq, initial)

    match a:
        case OrderedPair():
            return OrderedPair(x=a.x, y=y)
        case Vector():
            return Vector(v=y)
        case Scalar():
            return Scalar(c=y)
