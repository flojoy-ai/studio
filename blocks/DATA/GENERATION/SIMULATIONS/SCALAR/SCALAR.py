from flojoy import flojoy, Scalar, DataContainer
from typing import Optional


@flojoy
def SCALAR(
    _: Optional[DataContainer] = None,
    value: float = 3.0,
) -> Scalar:
    """Return a single Scalar value.

    Parameters
    ----------
    value : float
        The value set in Parameters

    Returns
    -------
    Scalar
        c: return the value being set in Parameters
    """

    return Scalar(c=value)
