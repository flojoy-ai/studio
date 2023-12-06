import json
import traceback
from typing import Optional

import can
from flojoy import DataContainer, SerialDevice, TextBlob, Vector, flojoy


@flojoy(deps={"python-can": "4.2.2"})
def CAN_MESSAGE(
    device: SerialDevice,
    message: Vector | Optional[DataContainer] = None,
    # arbitration_id: hex = 0xC0FFEE, TODO: Support hex inputs
    is_extended_id: bool = True,
) -> TextBlob:
    """Send a message onto a CAN network through a slcan-compatible USB-to-CAN adapter.

    Inputs
    ------
    message : Vector
        The array of data to send to the CAN bus.

    Parameters
    ----------
    arbitration_id : int
        Unique ID for message being sent.
    is_extended_id : bool
        Flag that controls the size of the arbitration_id field.

    Returns
    -------
    Textblob
        Traceback error
    """

    s = ""
    try:
        can.rc["interface"] = "slcan"
        can.rc["channel"] = device.get_port()
        can.rc["bitrate"] = 500000

        s = json.dumps(can.rc)

        msg = can.Message(
            data=message.v, arbitration_id=0xC0FFEE, is_extended_id=is_extended_id
        )

        with can.Bus() as bus:
            bus.send(msg)
    except Exception:
        s = traceback.format_exc()

    return TextBlob(s)
