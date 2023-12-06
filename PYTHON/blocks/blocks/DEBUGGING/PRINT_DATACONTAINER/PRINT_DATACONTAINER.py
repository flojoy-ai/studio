from flojoy import DataContainer, TextBlob, flojoy


@flojoy()
def PRINT_DATACONTAINER(
    default: DataContainer,
) -> TextBlob:
    """Return a TextBlob containing input DataContainer information.

    Must use the TEXT_VIEW block to view the text.

    Parameters
    ----------
    default : DataContainer
        The input DataContainer to print.

    Returns
    -------
    DataContainer
        TextBlob: Input datacontainer information
    """

    return TextBlob(text_blob=str(default))
