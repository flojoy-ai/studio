from flojoy import flojoy, Stateful, DataContainer
from typing import Optional
import can


@flojoy(deps={"python-can": "4.3.1", "asammdf": "7.4.1"})
def MF4_WRITE(
    MF4_writer: Stateful,
    messages: Stateful,
) -> Optional[DataContainer]:
    """Write a message to a MF4 writer.

    Logs CAN data to an ASAM Measurement Data File v4 (.mf4).
    The MF4 Writer does not support append mode.
    A writer must be created and connected to this block before any data can be written to it, use `MF4_CREATE_WRTIER` to do so.

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
