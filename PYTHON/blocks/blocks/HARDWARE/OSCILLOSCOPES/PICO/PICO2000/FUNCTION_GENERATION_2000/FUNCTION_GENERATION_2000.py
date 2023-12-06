from flojoy import flojoy, DataContainer, TextBlob
from typing import Optional, Literal
import ctypes
from picosdk.ps2000 import ps2000 as ps
from picosdk.functions import assert_pico2000_ok


@flojoy(deps={"picosdk": "1.1"})
def FUNCTION_GENERATION_2000(
    offset_voltage: int = 0,
    amplitude: int = 1e6,
    wave_type: Literal["0", "1", "2", "3", "4", "5", "6", "7"] = "1",
    start_frequency: int = 1e4,
    end_frequency: int = 1e5,
    sweep_increment: int = 1e3,
    dwell_time: int = 1,
    sweep_type: Literal["0", "1", "2", "3"] = "0",
    sweeps: int = 0,
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """Control wavefunction generation from a PicoScope.

    Note that this block requires the CONNECTION_2000 block.

    Also note that the P2000 blocks require a device specific driver/SDK downloaded from:
    https://www.picotech.com/downloads.

    Parameters
    ----------
    offset_voltage: int
        The offset (vertical) voltage, in uV (microvolts).
    amplitude: int
        The peak-to-peak amplitude, in uV (microvolts).
    wave_type: select
        The type of waveform to generate (e.g. 0 is a sine)
    start_frequency: int
        The static or starting frequency, in Hz.
    end_frequency: int
        The ending frequency if sweeping is activated, in Hz.
    sweep_increment: int
        The increment to increase frequency during sweeping, in Hz
    dwell_time: int = 1,
        The time to dwell at a frequency during sweeping, in ms.
    sweep_type: Literal["0", "1", "2", "3"] = "0",
        The type of sweeping. 0 deactivates sweeping.
    sweeps: int = 0,
        The number of sweeps.

    Returns
    -------
    TextBlob
        Placeholder return currently
    """

    device_num = ctypes.c_int16(1)

    wave_type = ctypes.c_int32(int(wave_type))
    sweep_type = ctypes.c_int32(int(sweep_type))

    res = ps.ps2000_set_sig_gen_built_in(
        device_num,
        offset_voltage,
        amplitude,
        wave_type,
        start_frequency,
        end_frequency,
        sweep_increment,
        dwell_time,
        int(sweep_type),
        sweeps,
    )

    assert_pico2000_ok(res)

    return TextBlob(text_blob=str(1))
