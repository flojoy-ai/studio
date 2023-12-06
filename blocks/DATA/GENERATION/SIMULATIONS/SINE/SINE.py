import numpy as np
from flojoy import flojoy, OrderedPair, Vector
from scipy import signal
from typing import Literal


@flojoy
def SINE(
    default: OrderedPair | Vector,
    amplitude: float = 1,
    frequency: float = 1,
    offset: float = 0,
    phase: float = 0,
    waveform: Literal["sine", "square", "triangle", "sawtooth"] = "sine",
) -> OrderedPair:
    """Generate a waveform with a given shape (sine, sawtooth, etc).

    Inputs
    ------
    default : OrderedPair|Vector
        Input that defines the x-axis values of the function and output.

    Parameters
    ----------
    waveform : select
        The waveform type of the wave.
    amplitude : float
        The amplitude of the wave.
    frequency : float
        The wave frequency in radians/2pi.
    offset : float
        The y axis offset of the function.
    phase : float
        The x axis offset of the function.

    Returns
    -------
    OrderedPair
        x: the input v or x values
        y: the resulting sine function
    """

    A = amplitude
    F = frequency
    Y0 = offset

    match default:
        case OrderedPair():
            x = default.y
        case _:
            x = default.v

    if waveform == "sine":
        y = Y0 + A * np.sin(2 * np.pi * F * x + phase)
    elif waveform == "square":
        y = Y0 + A * signal.square(2 * np.pi * F * x / 10 + phase)
    elif waveform == "triangle":
        y = Y0 + A * signal.sawtooth(2 * np.pi * F * x / 10 + phase, 0.5)
    elif waveform == "sawtooth":
        y = Y0 + A * signal.sawtooth(2 * np.pi * F / 10 * x + phase)

    return OrderedPair(x=x, y=y)
