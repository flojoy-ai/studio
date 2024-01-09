import numpy as np
from flojoy import OrderedPair, flojoy, Scalar, Vector
from typing import Literal
from blocks.MATH.ARITHMETIC.utils.arithmetic_utils import get_val
from functools import reduce


@flojoy
def LOG(
    a: OrderedPair | Scalar | Vector,
    b: list[OrderedPair | Scalar | Vector],
    log_base: Literal["input", "e", "10", "2"] = "e",
) -> OrderedPair | Scalar | Vector:
    """Multiply two numeric arrays, vectors, matrices, or constants element-wise.

    Parameters
    ----------
    a : OrderedPair|Scalar|Vector
        The input a use to compute the product of a and b.
    b : Scalar
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

    # match log_base:
    #     case "e":
    #         b = Scalar(c=np.e)
    #     case "10":
    #         b = Scalar(c=10)
    #     case "2":
    #         b = Scalar(c=2)
    #     case _:
    #         pass

    initial = get_val(a)
    seq = map(lambda dc: get_val(dc), b)
    print("debug ", initial, seq, flush=True)
    # y = lambda u, v: np.log(u) / np.log(v)  # , seq, initial
    # print("debug ", y, flush=True)
    # y = reduce(lambda u: np.log(u), seq)
    y = reduce(lambda u, v: np.log(u) / np.log(v), seq, initial)

    match a:
        case OrderedPair():
            return OrderedPair(x=a.x, y=y)
        case Vector():
            return Vector(v=y)
        case Scalar():
            return Scalar(c=y)
