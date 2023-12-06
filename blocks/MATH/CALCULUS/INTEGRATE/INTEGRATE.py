from flojoy import flojoy, OrderedPair, Vector
import numpy as np


def trapz(x: np.ndarray, y: np.ndarray):
    m = [0] * len(x)
    trapezium = (1 / 2) * (x[1] - x[0]) * (y[1] + y[0])
    m[1] = trapezium

    for i in range(2, len(x)):
        trapezium = (1 / 2) * (x[i] - x[i - 1]) * (y[i] + y[i - 1])
        m[i] = m[i - 1] + trapezium

    return m


@flojoy
def INTEGRATE(default: OrderedPair | Vector) -> OrderedPair:
    """Integrate over an OrderedPair or Vector using the composite trapezoidal rule.

    Parameters
    ----------
    default : OrderedPair|Vector
        Input from which we get the two lists we use in the integration.

    Returns
    -------
    OrderedPair
        x: the x-axis of the input.
        y: the result of the integral.
    """

    match default:
        case OrderedPair():
            input_x = default.x
            input_y = default.y
        case Vector():
            input_x = np.arange(len(default.v))
            input_y = default.v

    if type(input_x) != np.ndarray:
        raise ValueError(f"Invalid type for x:{type(input_x)}")
    elif type(input_y) != np.ndarray:
        raise ValueError(f"Invalid type for y:{type(input_y)}")
    elif len(input_x) != len(input_y):
        raise ValueError(
            f"X and Y keys must have the same length got, x:{len(input_x)} y:{len(input_y)}"
        )

    integrate = trapz(input_x, input_y)

    return OrderedPair(x=input_x, y=integrate)
