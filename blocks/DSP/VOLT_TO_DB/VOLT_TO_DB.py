import numpy as np
from flojoy import OrderedPair, Vector, flojoy


@flojoy
def VOLT_TO_DB(
    data: OrderedPair | Vector,
    ref_value: float,
) -> OrderedPair | Vector:
    """Take voltage values and convert them to dB.

    Equation: f(x) = 20 * log[10](x / ref_value)

    Parameters
    ----------
    data : OrderedPair|Vector
        The input to apply the absolute value to.
    ref_value : float
        The reference

    Returns
    -------
    OrderedPair
        x: the x-axis of the input.
        y: the absolute value of the input.
    """

    match data:
        case OrderedPair():
            y = 20 * np.log10(data.y / ref_value)
            return OrderedPair(x=data.x, y=y)
        case Vector():
            v = 20 * np.log10(data.v / ref_value)
            return Vector(v=v)
