import traceback

import can
from flojoy import Scalar, TextBlob, flojoy
from tinymovr.config import create_device, get_bus_config
from tinymovr.tee import destroy_tee, init_tee


@flojoy(deps={"tinymovr": "1.6.2"})
def TINYMOVR_SET_VELOCITY(default: Scalar) -> TextBlob:
    """Direct a tinymovr BLDC driver to a set velocity.

    Parameters
    ----------
    velocity : Scalar
        Servo velocity (10k ticks/sec [1, 15]).

    Returns
    -------
    Textblob
        Traceback error (if any)
    """

    tb = ""
    bitrate = 1000000
    params = get_bus_config(["canine", "slcan_disco"])
    params["bitrate"] = bitrate
    velocity_multiplier = 10000
    MAX_v = 15
    MIN_v = 1

    velocity = sorted((MIN_v, default.c, MAX_v))[1]

    try:
        # Connect to servo over CAN network
        # TODO: Consider saving Avlos tm Python object in HW device context manager
        # Reference: https://github.com/tinymovr/avlos
        with can.Bus(**params) as bus:
            init_tee(bus)
            tm = create_device(node_id=1)
            tm.controller.velocity_mode()
            tm.controller.velocity.setpoint = velocity * velocity_multiplier
            destroy_tee()
    except Exception:
        tb = traceback.format_exc()

    return TextBlob(text_blob=tb)
