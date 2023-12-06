from flojoy import String, flojoy
from typing import Literal


@flojoy
def TEXT_CONCAT(
    a: String,
    b: String,
    delimiter: Literal[
        "space", "comma", "semicolon", "colon", "new line", "none"
    ] = "space",
) -> String:
    """Concatenate 2 strings given by 2 String DataContainers.

    Inputs
    ------
    a: String
        The input text to be concatenated to input b

    b: String
        The input text to be concatenated to input a

    Parameters
    ----------
    delimiter: "space" | "comma" | "semicolon" | "colon" | "new line" | "none", default="space"
        Select the delimiter to place between two text.

    Returns
    -------
    String
       The text result from concatenation.
    """

    delim: str = None
    match delimiter:
        case "space":
            delim = " "
        case "comma":
            delim = ","
        case "semicolon":
            delim = ";"
        case "colon":
            delim = ":"
        case "new line":
            delim = "\n"
        case "none":
            delim = ""

    return String(s=delim.join([a.s, b.s]))
