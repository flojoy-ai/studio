from flojoy import String, flojoy, DataContainer
from typing import Optional


@flojoy
def TEXT(
    _: Optional[DataContainer] = None,
    value: str = "Hello World!",
) -> String:
    """Return a String DataContainer with given input text.

    Parameters
    ----------
    value : str
        The value set in Parameters.

    Returns
    -------
    String
        Return the value being set in Parameters.
    """

    return String(s=value)
