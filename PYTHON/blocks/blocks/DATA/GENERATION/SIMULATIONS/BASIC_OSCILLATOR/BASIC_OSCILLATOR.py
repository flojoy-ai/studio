import numpy as np
from flojoy import flojoy, OrderedPair
from scipy import signal
from typing import Literal


@flojoy
def BASIC_OSCILLATOR(
    sample_rate: int = 100,
    time: int = 10,
    waveform: Literal["sine", "square", "triangle", "sawtooth"] = "sine",
    amplitude: float = 1,
    frequency: float = 1,
    offset: float = 0,
    phase: float = 0,
) -> OrderedPair:
    """Generate an oscillator signal (a shorthand combination of the SINE and LINSPACE blocks).

    It offers a more straightforward way to generate signals, with sample rate and the time in seconds as parameters, along with all the parameters in the SINE block.

    Parameters
    ----------
    sample_rate : float
        The number of samples that are taken in a second.
    time : float
        The total amount of time of the signal.
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
        x: time domain
        y: generated signal
    """

    samples = sample_rate * time
    x = np.linspace(0, time, samples)

    if waveform == "sine":
        y = offset + amplitude * np.sin(2 * np.pi * frequency * x + phase)
    elif waveform == "square":
        y = offset + amplitude * signal.square(2 * np.pi * frequency * x + phase)
    elif waveform == "triangle":
        y = offset + amplitude * signal.sawtooth(2 * np.pi * frequency * x + phase, 0.5)
    else:  # Sawtooth
        y = offset + amplitude * signal.sawtooth(2 * np.pi * frequency * x + phase)

    return OrderedPair(x=x, y=y)
