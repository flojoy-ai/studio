from flojoy import flojoy, File, Stateful, DataContainer
import can
from typing import Optional


@flojoy()
def MF4_CREATE_READER(
    file: File,
    default: Optional[DataContainer] = None,
) -> Stateful:
    """Create a file reader for the MF4 format.

    Read CAN data from an ASAM Measurement Data File v4 (.mf4) as specified by the ASAM MDF standard (see https://www.asam.net/standards/detail/mdf/).

    Parameters
    ----------
    file : File
        The file to write from.

    Returns
    -------
    Stateful
        A stateful object that contains can a list of message.
    """

    reader = can.io.MF4Reader(file.unwrap())

    messages = []
    for message in reader:
        messages.append(message)

    return Stateful(messages)
