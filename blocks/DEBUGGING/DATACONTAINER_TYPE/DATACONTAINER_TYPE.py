from flojoy import DataContainer, String, flojoy


@flojoy()
def DATACONTAINER_TYPE(
    default: DataContainer,
) -> String:
    """Return a String containing the input DataContainer type (e.g. Vector).

    Must use the TEXT_VIEW block to view the text.

    Parameters
    ----------
    default : DataContainer
        The input DataContainer to check the type.

    Returns
    -------
    DataContainer
        String: Input DataContainer type
    """

    return String(s=default.type)
