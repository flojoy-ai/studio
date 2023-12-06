import pprint
from flojoy import flojoy, String, Boolean


@flojoy
def TEXT_VIEW(default: String | Boolean, prettify: bool = False) -> String:
    """The TEXT_VIEW node creates a text visualization for a given String DataContainer type.

    Inputs
    ------
    default : String | Boolean
        The DataContainer to be visualized in text format

    Parameters
    ----------
    prettify : Boolean
        Whether to prettify the displayed text (defaults to True)

    Returns
    -------
    String
        The DataContainer containing text data
    """

    match default:
        case String():
            s = default.s

            if prettify:
                s = pprint.pformat(default.s)

            return String(s)
        case Boolean():
            if default.b:
                return String("True")

            return String("False")
