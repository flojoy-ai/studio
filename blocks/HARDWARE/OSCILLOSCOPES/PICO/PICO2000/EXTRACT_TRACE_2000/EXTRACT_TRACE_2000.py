from flojoy import flojoy, DataContainer, OrderedPair
from typing import Optional, Literal
import ctypes
from numpy import linspace
from picosdk.ps2000 import ps2000 as ps
from picosdk.functions import adc2mV, assert_pico2000_ok, mV2adc


@flojoy(deps={"picosdk": "1.1"})
def EXTRACT_TRACE_2000(
    channel: Literal["A", "B"] = "A",
    coupling_type: Literal["0", "1", "2"] = "1",
    trig_threshold: float = 300,
    trig_direction: Literal["0", "1", "2"] = "1",
    x_samples: int = 1000,
    default: Optional[DataContainer] = None,
) -> OrderedPair:
    """Extract scope traces from a P2000 PicoScope.

    Note that this block requires the CONNECTION_2000 block.

    Also note that the P2000 block require a device specific driver/SDK downloaded from:
    https://www.picotech.com/downloads.

    Parameters
    ----------
    channel: select
        Select the channel to extract a trace from.
    coupling_type: select
        Select the coupling type (0:AC, 1:DC)
    trig_threshold: float
        The threshold to trigger the oscilloscope timing, in mV.
    trig_direction: select
        The direction (slope) to search for a trigger (1:Rising, 2:Falling).
    x_samples: int
        The number of samples in time (i.e. # of x axis pixels).

    Returns
    -------
    OrderedPair
        The trace of the oscilloscope is returned.
    """

    status = {}
    device_num = ctypes.c_int16(1)
    # find maximum ADC count value
    maxADC = ctypes.c_int16(32767)

    # Set up channel
    if channel == "A":
        chan_num = 0  # 0=A, 1=B
    else:
        chan_num = 1
    enabled = 1
    coupling_type = int(coupling_type)
    ch_range = 7
    status["setCh"] = ps.ps2000_set_channel(
        device_num, chan_num, enabled, coupling_type, ch_range
    )
    assert_pico2000_ok(status["setCh"])

    # Set up single trigger
    source = chan_num
    # convert mV counts data to ADC
    threshold = mV2adc(trig_threshold, ch_range, maxADC)
    direction = int(trig_direction)  # 0=RISING 1=falling
    delay = 0  # ms
    trigger = 1000  # ms
    status["trigger"] = ps.ps2000_set_trigger(
        device_num, source, int(threshold / 16), direction, delay, trigger
    )
    assert_pico2000_ok(status["trigger"])

    # Get timebase information
    timebase = 8
    timeInterval = ctypes.c_int32()
    timeUnits = ctypes.c_int32()
    oversample = ctypes.c_int16(1)
    maxSamplesReturn = ctypes.c_int32()
    status["getTimebase"] = ps.ps2000_get_timebase(
        device_num,
        timebase,
        x_samples,
        ctypes.byref(timeInterval),
        ctypes.byref(timeUnits),
        oversample,
        ctypes.byref(maxSamplesReturn),
    )
    assert_pico2000_ok(status["getTimebase"])

    # Run block capture
    timeIndisposedms = ctypes.c_int32()
    status["runBlock"] = ps.ps2000_run_block(
        device_num, x_samples, timebase, oversample, ctypes.byref(timeIndisposedms)
    )
    assert_pico2000_ok(status["runBlock"])

    # Check for data collection to finish using ps5000aIsReady
    ready = ctypes.c_int16(0)
    check = ctypes.c_int16(0)
    while ready.value == check.value:
        status["isReady"] = ps.ps2000_ready(device_num)
        ready = ctypes.c_int16(status["isReady"])

    # Create buffers ready for data
    bufferA = (ctypes.c_int16 * x_samples)()
    bufferB = (ctypes.c_int16 * x_samples)()

    # Get data from scope
    cmaxSamples = ctypes.c_int32(x_samples)
    status["getValues"] = ps.ps2000_get_values(
        device_num,
        ctypes.byref(bufferA),
        ctypes.byref(bufferB),
        None,
        None,
        ctypes.byref(oversample),
        cmaxSamples,
    )
    assert_pico2000_ok(status["getValues"])

    # convert ADC counts data to mV
    if channel == "A":
        signal = adc2mV(bufferA, ch_range, maxADC)
    else:
        signal = adc2mV(bufferB, ch_range, maxADC)

    # Create time data
    time = linspace(0, (cmaxSamples.value - 1) * timeInterval.value, cmaxSamples.value)

    # # Stop the scope
    # status["stop"] = ps.ps2000_stop(device_num)
    # assert_pico2000_ok(status["stop"])

    return OrderedPair(x=time, y=signal)
