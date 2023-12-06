import pprint
from flojoy import flojoy, TextBlob, Boolean


@flojoy
def TEXT_VIEW(default: TextBlob | Boolean, prettify: bool = False) -> TextBlob:
    """The TEXT_VIEW node creates a text visualization for a given TextBlob DataContainer type.

    Inputs
    ------
    default : TextBlob | Boolean
        The DataContainer to be visualized in text format

    Parameters
    ----------
    prettify : Boolean
        Whether to prettify the displayed text (defaults to True)

    Returns
    -------
    TextBlob
        The DataContainer containing text data
    """

    match default:
        case TextBlob():
            s = default.text_blob

            if prettify:
                s = pprint.pformat(default.text_blob)

            return TextBlob(s)
        case Boolean():
            if default.b:
                return TextBlob("True")

            return TextBlob("False")
