from flojoy import flojoy, Stateful, DataContainer
from typing import Optional
import can


@flojoy()
def MF4_WRITE(
    MF4_writer: Stateful,
    messages: Stateful,
) -> Optional[DataContainer]:
    """Create a writer for the MF4 format.

    Logs CAN data to an ASAM Measurement Data File v4 (.mf4). MF4Writer does not support append mode.

    Parameters
    ----------
    MF4_writer : Stateful
        A mf4 writer object from a MF4_CREATE_WRITER block.
    messages : Stateful
        A list of message in the python-can format.

    Returns
    -------
    Optional[DataContainer]
        None
    """

    writer: can.io.MF4Writer = MF4_writer.obj
    messages = messages.obj

    for message in messages:
        writer.on_message_received(message)

    return Stateful(writer)
