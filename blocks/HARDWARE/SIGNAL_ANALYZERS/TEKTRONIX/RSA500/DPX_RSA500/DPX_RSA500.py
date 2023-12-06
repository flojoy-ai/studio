from flojoy import flojoy, DataContainer, Surface
from typing import Optional, TypedDict
from flojoy.instruments.tektronix.RSA_API import *  # noqa: F403
from ctypes import cdll, c_int, c_bool, c_double, c_int32, byref
from os import path
import numpy as np


class DPXSplitOutput(TypedDict):
    bitmap: Surface
    dpx_ogram: Surface


@flojoy
def DPX_RSA500(
    input: Optional[DataContainer] = None,
    center_freq: float = 100e6,
    ref_level: float = -30,
    span: float = 1e6,
    bandwidth: float = 20e3,
) -> DPXSplitOutput:
    """Run DPX (Digital Phosphor) analysis on the RSA500.

    This block should also work with compatible Tektronix RSAXXX instruments.

    Tested with RSA507a.

    Parameters
    ----------
    center_freq : float, default=100e6
        The center frequency, in Hz.
    ref_level : float, default=-30
        The reference level (the maximum y axis value), in dBm.
    span : float, default=1e6
        The width of the x axis, in Hz.
    bandwidth : float, default=20e3
        Resolution bandwidth, in Hz.

    Returns
    -------
    bitmap: Surface
        x: frequency
        y: power
        z: occurances
    dpx_ogram: Surface
        x: frequency
        y: trace number
        z: occurances
    """

    # Connect to RSA
    defau = "C:/Tektronix/RSA_API/lib/x64/RSA_API.dll"
    moved = "C:/Program Files/Tek/RSA_API/lib/x64/RSA_API.dll"
    if path.isfile(defau):
        rsa = cdll.LoadLibrary(defau)
    elif path.isfile(moved):
        rsa = cdll.LoadLibrary(moved)
    else:
        raise FileNotFoundError(
            "Cannot find RSA_API.dll. Download from: https://www.tek.com/en/products/spectrum-analyzers/rsa500"
        )

    numFound = c_int(0)
    intArray = c_int * DEVSRCH_MAX_NUM_DEVICES  # noqa: F405
    deviceIDs = intArray()
    deviceSerial = create_string_buffer(DEVSRCH_SERIAL_MAX_STRLEN)  # noqa: F405
    deviceType = create_string_buffer(DEVSRCH_TYPE_MAX_STRLEN)  # noqa: F405
    apiVersion = create_string_buffer(DEVINFO_MAX_STRLEN)  # noqa: F405

    rsa.DEVICE_GetAPIVersion(apiVersion)

    err_check(rsa.DEVICE_Search(byref(numFound), deviceIDs, deviceSerial, deviceType))  # noqa: F405

    # note: the API can only currently access one at a time
    # Connects to first available
    err_check(rsa.DEVICE_Connect(deviceIDs[0]))
    rsa.CONFIG_Preset()

    # Set up windows
    yTop = ref_level
    yBottom = yTop - 100
    yUnit = VerticalUnitType.VerticalUnit_dBm  # noqa: F405

    dpxSet = DPX_SettingStruct()  # noqa: F405
    rsa.CONFIG_SetCenterFreq(c_double(center_freq))
    rsa.CONFIG_SetReferenceLevel(c_double(ref_level))

    rsa.DPX_SetEnable(c_bool(True))
    rsa.DPX_SetParameters(
        c_double(span),
        c_double(bandwidth),
        c_int(801),
        c_int(1),
        yUnit,
        c_double(yTop),
        c_double(yBottom),
        c_bool(False),
        c_double(1.0),
        c_bool(False),
    )
    rsa.DPX_SetSogramParameters(
        c_double(1e-3), c_double(1e-3), c_double(ref_level), c_double(ref_level - 100)
    )
    rsa.DPX_Configure(c_bool(True), c_bool(True))

    rsa.DPX_SetSpectrumTraceType(c_int32(0), c_int(2))
    rsa.DPX_SetSpectrumTraceType(c_int32(1), c_int(4))
    rsa.DPX_SetSpectrumTraceType(c_int32(2), c_int(0))

    rsa.DPX_GetSettings(byref(dpxSet))
    dpxFreq = np.linspace(
        (center_freq - span / 2), (center_freq + span / 2), dpxSet.bitmapWidth
    )
    dpxAmp = np.linspace(yBottom, yTop, dpxSet.bitmapHeight)

    frameAvailable = c_bool(False)
    ready = c_bool(False)
    fb = DPX_FrameBuffer()  # noqa: F405

    # Acquire data
    rsa.DEVICE_Run()
    rsa.DPX_Reset()
    while not frameAvailable.value:
        rsa.DPX_IsFrameBufferAvailable(byref(frameAvailable))
        while not ready.value:
            rsa.DPX_WaitForDataReady(c_int(100), byref(ready))
    rsa.DPX_GetFrameBuffer(byref(fb))
    rsa.DPX_FinishFrameBuffer()
    rsa.DEVICE_Stop()
    dpxBitmap = np.array(fb.spectrumBitmap[: fb.spectrumBitmapSize])
    dpxBitmap = dpxBitmap.reshape((fb.spectrumBitmapHeight, fb.spectrumBitmapWidth))

    # Convert trace data from W to dBm
    # http://www.rapidtables.com/convert/power/Watt_to_dBm.htm
    # Note: fb.spectrumTraces is a pointer to a pointer, so we need to
    # go through an additional dereferencing step
    traces = []
    for i in range(3):
        traces.append(
            10
            * np.log10(1000 * np.array(fb.spectrumTraces[i][: fb.spectrumTraceLength]))
            + 30
        )

    dpxogram = np.array(fb.sogramBitmap[: fb.sogramBitmapSize])
    dpxogram = dpxogram.reshape((fb.sogramBitmapHeight, fb.sogramBitmapWidth))
    dpxogram = dpxogram[: fb.sogramBitmapNumValidLines, :]
    plotFreq = np.linspace(
        center_freq - span / 2.0, center_freq + span / 2.0, fb.sogramBitmapWidth
    )

    rsa.DEVICE_Disconnect()

    return DPXSplitOutput(
        bitmap=Surface(x=dpxFreq, y=dpxAmp, z=np.flip(dpxBitmap, axis=0)),
        dpx_ogram=Surface(x=plotFreq, y=np.arange(dpxBitmap.shape[1]), z=dpxogram),
    )


def err_check(rs):
    if ReturnStatus(rs) != ReturnStatus.noError:  # noqa: F405
        raise RSAError(ReturnStatus(rs).name)  # noqa: F405
