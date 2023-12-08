from flojoy import DataContainer, String, flojoy
from pprint import pformat, pprint


@flojoy()
def PRINT_DATACONTAINER(
    default: DataContainer,
) -> String:
    """Return a String containing input DataContainer information.

    Must use the TEXT_VIEW block to view the text.

    Parameters
    ----------
    default : DataContainer
        The input DataContainer to print.

    Returns
    -------
    DataContainer
        String: Input datacontainer information
    """

    return String(s=f"```\n{pformat(default.to_dict())}\n```")
