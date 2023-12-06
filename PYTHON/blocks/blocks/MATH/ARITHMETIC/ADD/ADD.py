from functools import reduce

import numpy as np
from flojoy import OrderedPair, Scalar, Vector, flojoy

from blocks.MATH.ARITHMETIC.utils.arithmetic_utils import get_val


@flojoy
def ADD(
    a: OrderedPair | Scalar | Vector, b: list[OrderedPair | Scalar | Vector]
) -> OrderedPair | Scalar | Vector:
    """Add two or more numeric arrays, matrices, dataframes, or constants element-wise.

    When a constant is added to an array or matrix, each element in the array or matrix will be increased by the constant value.

    If two arrays or matrices of different sizes are added, the output will be the size of the larger array or matrix with only the overlapping elements changed.

    Parameters
    ----------
    a : OrderedPair|Scalar|Vector
        The input a use to compute the sum of a and b.
    b : OrderedPair|Scalar|Vector
        The input b use to compute the sum of a and b.

    Returns
    -------
    OrderedPair|Scalar|Vector
        OrderedPair if a is an OrderedPair.
        x: the x-axis of input a.
        y: the sum of input a and input b.

        Scalar if a is a Scalar.
        c: the sum of input a and input b.

        Vector if a is a Vector.
        v: the sum of input a and input b.
    """

    initial = get_val(a)
    seq = map(lambda dc: get_val(dc), b)
    y = reduce(lambda u, v: np.add(u, v), seq, initial)

    match a:
        case OrderedPair():
            return OrderedPair(x=a.x, y=y)
        case Vector():
            return Vector(v=y)
        case Scalar():
            return Scalar(c=y)
