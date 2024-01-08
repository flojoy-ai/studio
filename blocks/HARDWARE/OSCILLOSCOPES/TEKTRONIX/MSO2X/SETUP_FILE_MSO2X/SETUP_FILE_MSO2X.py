from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, String, DataContainer


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def SETUP_FILE_MSO2X(
    connection: VisaConnection,
    save_or_recall: Literal["save", "recall"] = "save",
    filename: str = "flojoy",
    input: Optional[DataContainer] = None,
) -> String:
    """Saves or recalls a instrument setup file (.set).

    The file currently can only be located in the instruments C drive (C:/)

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    save_or_recall : select, default=save
        Save or recall the file.
    filename : str, default=flojoy
        The file name to save or recall ("flojoy" results in "C:/flojoy.set").

    Returns
    -------
    String
        Filename
    """

    # Retrieve oscilloscope instrument connection.
    scope = connection.get_handle()

    if save_or_recall == "save":
        scope.commands.save.setup.write(f"c:/{filename}.set")
    elif save_or_recall == "recall":
        scope.commands.recall.setup.write(f'"c:/{filename}.set"')

    return String(s=f"{filename}")
