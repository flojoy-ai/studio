from flojoy import flojoy, DataContainer, String
from typing import Optional
import ctypes
from picosdk.ps2000 import ps2000 as ps
from picosdk.functions import assert_pico2000_ok


@flojoy(deps={"picosdk": "1.1"})
def CONNECTION_2000(
    default: Optional[DataContainer] = None,
) -> String:
    """Connect Flojoy to an available Picoscope.

    If more than one P2000 oscilloscope is available, the first one connected
    to the PC will likely be chosen. If you need specific device selection,
    please contact us at: https://www.flojoy.ai/contact-sales.

    Note the P2000 nodes require a device specific driver/SDK downloaded from:
    https://www.picotech.com/downloads.

    Parameters
    ----------
    None

    Returns
    -------
    String
        Placeholder return currently
    """

    ps.ps2000_close_unit(ctypes.c_int16(1))

    status = {}
    status["openUnit"] = ps.ps2000_open_unit()
    assert_pico2000_ok(status["openUnit"])

    return String(s=str(status["openUnit"]))
