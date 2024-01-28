from flojoy import flojoy, Stateful, DataContainer
from typing import Optional
import can


@flojoy()
def MF4_CLOSE_WRITER(
    MF4_writer: Stateful,
    default: Optional[Stateful] = None,
) -> Optional[DataContainer]:
    """Close a MF4 writer.
    
    This closes the file that was opened by MF4_CREATE_WRITER.
    Optional since it is call automatically when the program ends.
    Usefull if you want to close (and save) the file before the program ends. Example, before uploading it to the cloud.

    Parameters
    ----------
    MF4_writer : Stateful
        A mf4 writer object from a MF4_CREATE_WRITER block.

    Returns
    -------
    Optional[DataContainer]
        None
    """

    writer: can.io.MF4Writer = MF4_writer.obj
    writer.stop()

    return None
