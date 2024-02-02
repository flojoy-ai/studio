from flojoy import flojoy, Stateful
from typing import Optional
import can


@flojoy(deps={"python-can": "4.3.1"})
def CREATE_CAN_MESSAGE(
    frame_id: int,
    data: list[int],
    error_frame: bool = False,
    can_fd: bool = False,
    channel: Optional[str] = None
) -> Stateful:
    """Create a CAN message.

    Create a CAN message that can be used to send to real systems.

    Parameters
    ----------
    frame_id : int
        The frame ID.
    data : list[int]
        The data to be sent. Will be converted in an array of bytes.
    error_frame : bool
        Whether the frame is an error frame, by default False.
    can_fd : bool
        Whether the frame is a CAN FD frame (Flexible Data-Rate), by default False.
    channel : Optional string
        Optional Channel id.

    Returns
    -------
    Stateful
        A list of can message with the message created.
    """

    is_extended_id = frame_id >= 0x800
    data = bytearray(data)
    error_state_indicator = False
    if error_frame and can_fd:
        error_state_indicator = True
        error_frame = False

    message = can.Message(
        arbitration_id=frame_id,
        is_extended_id=is_extended_id,
        data=data,
        is_error_frame=error_frame,
        is_fd=can_fd,
        is_rx=False,
        error_state_indicator=error_state_indicator,
        channel=channel if channel != "" else None,
        check=True
    )

    return Stateful([message])
