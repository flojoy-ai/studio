from flojoy import flojoy, Stateful
import can
from typing import Optional, Literal


@flojoy()
def FILTER_CAN_BY_ERROR(
    messages: Stateful
) -> Stateful:
    """Filter a list of can messages to only contain error messages

    Retain only the messages that are errors

    Parameters
    ----------
    messages: Stateful
        Stateful connection with a list of can.Message

    Returns
    -------
    Stateful:
        Stateful object with only the messages with the `message_id`
    """

    messages: can.Message = messages.obj

    filtered = list(filter(lambda msg: msg.is_error_frame or msg.error_state_indicator, messages))

    return Stateful(obj=filtered)
