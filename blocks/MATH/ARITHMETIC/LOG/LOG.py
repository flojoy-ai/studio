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
    """Find the logarithm of input a with base b.

    Calculated element-wise for a Vector or OrderedPair input.

    Use log_base "input" to use the bottom input as the base.

    Parameters
    ----------
    a : OrderedPair|Scalar|Vector
        The input a use to compute the log of a.
    b : OrderedPair|Scalar|Vector
        The input b use to compute the log with base b.

    Returns
    -------
    OrderedPair|Scalar|Vector
        OrderedPair if a is an OrderedPair.
        x: the x-axis of input a.
        y: the result of the logarithm.

        Scalar if a is a Scalar.
        c: the result of the logarithm.

        Vector if a is a Vector.
        v: the result of the logarithm.
    """

    initial = get_val(a)
    seq = map(lambda dc: get_val(dc), b)

    match log_base:
        case "e":
            y = reduce(lambda u, v: np.log(u), seq, initial)
        case "10":
            y = reduce(lambda u, v: np.log10(u), seq, initial)
        case "2":
            y = reduce(lambda u, v: np.log2(u), seq, initial)
        case "input":
            y = reduce(lambda u, v: np.log(u) / np.log(v), seq, initial)

    match a:
        case OrderedPair():
            return OrderedPair(x=a.x, y=y)
        case Vector():
            return Vector(v=y)
        case Scalar():
            return Scalar(c=y)
