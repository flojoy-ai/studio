from flojoy import TextBlob, flojoy
from typing import Literal


@flojoy
def TEXT_CONCAT(
    a: TextBlob,
    b: TextBlob,
    delimiter: Literal[
        "space", "comma", "semicolon", "colon", "new line", "none"
    ] = "space",
) -> TextBlob:
    """Concatenate 2 strings given by 2 TextBlob DataContainers.

    Inputs
    ------
    a: TextBlob
        The input text to be concatenated to input b

    b: TextBlob
        The input text to be concatenated to input a

    Parameters
    ----------
    delimiter: "space" | "comma" | "semicolon" | "colon" | "new line" | "none", default="space"
        Select the delimiter to place between two text.

    Returns
    -------
    TextBlob
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

    return TextBlob(text_blob=delim.join([a.text_blob, b.text_blob]))
