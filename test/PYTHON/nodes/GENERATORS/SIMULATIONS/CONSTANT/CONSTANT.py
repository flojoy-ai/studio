import numpy as np
from flojoy import flojoy, OrderedPair
from typing import Optional


@flojoy
def CONSTANT(
    default: Optional[OrderedPair] = None, constant: float = 3.0
) -> OrderedPair:
    """Generates a single x-y vector of numeric (floating point) constants"""
    x = np.arange(0, 1000, 1)  # type: ignore
    if default:
        x = default.y
    y = np.full(len(x), constant)
    return OrderedPair(x=x, y=y)
