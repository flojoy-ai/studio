from flojoy import flojoy, Stateful
import can


@flojoy(deps={"python-can": "4.3.1"})
def FILTER_CAN_BY_ID(
    message_id: int,
    messages: Stateful
) -> Stateful:
    """Filter a list of can messages

    Get a specific id message id from a list of messages

    Parameters
    ----------
    message_id: int
        the id of the messages to extract from the list of messages
    messages: Stateful
        Stateful connection with a list of can.Message

    Returns
    -------
    Stateful:
        Stateful object with only the messages with the `message_id`
    """

    messages: can.Message = messages.obj

    filtered = list(filter(lambda msg: msg.arbitration_id == message_id, messages))

    return Stateful(obj=filtered)
