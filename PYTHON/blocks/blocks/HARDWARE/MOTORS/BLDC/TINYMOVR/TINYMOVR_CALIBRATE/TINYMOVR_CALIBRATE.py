import traceback

import can
from flojoy import TextBlob, flojoy
from tinymovr.config import create_device, get_bus_config
from tinymovr.tee import destroy_tee, init_tee


@flojoy(deps={"tinymovr": "1.6.2"})
def TINYMOVR_CALIBRATE() -> TextBlob:
    """Discover and calibrate a connected tinymovr BLDC driver through a CANine USB-to-CAN controller.

    Parameters
    ----------
    None

    Returns
    -------
    TextBlob
        Traceback error
    """

    bitrate = 1000000
    params = get_bus_config(["canine", "slcan_disco"])
    params["bitrate"] = bitrate
    tb = ""

    try:
        with can.Bus(**params) as _:
            init_tee(can.Bus(**params))
            tm = create_device(node_id=1)
            tm.controller.calibrate()
            destroy_tee()
    except Exception:
        tb = traceback.format_exc()

    return TextBlob(text_blob=tb)
