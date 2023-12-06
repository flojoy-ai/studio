from numpy import arange, full
from flojoy import flojoy, Vector, OrderedPair, Scalar
from typing import Optional, Literal


@flojoy
def CONSTANT(
    default: Optional[Vector | OrderedPair] = None,
    dc_type: Literal["Scalar", "Vector", "OrderedPair"] = "OrderedPair",
    constant: float = 3.0,
    step: float = 1000,
) -> OrderedPair | Vector | Scalar:
    """Generate a single x-y vector of numeric (floating point) constants.

    Inputs
    ------
    default : OrderedPair|Vector
        Optional input that defines the size of the output.

    Parameters
    ----------
    dc_type : select
        The type of DataContainer to return.
    constant : float
        The value of the y axis output.
    step : int
        The size of the y and x axes.

    Returns
    -------
    OrderedPair|Vector|Scalar
        OrderedPair if selected
        x: the x axis generated with size 'step'
        y: the resulting constant with size 'step'
        Vector if selected
        v: the resulting constant with size 'step'
        Scalar if selected
        c: the resulting constant
    """

    x = arange(0, step, 1)
    if default:
        match default:
            case OrderedPair():
                x = default.y
            case Vector():
                x = default.v
    y = full(len(x), constant)

    match dc_type:
        case "OrderedPair":
            return OrderedPair(x=x, y=y)
        case "Vector":
            return Vector(v=y)
        case "Scalar":
            return Scalar(c=constant)
