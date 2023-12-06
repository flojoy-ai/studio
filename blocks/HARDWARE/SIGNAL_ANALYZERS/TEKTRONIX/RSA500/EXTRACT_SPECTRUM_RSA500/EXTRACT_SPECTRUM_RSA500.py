from flojoy import flojoy, DataContainer, OrderedPair
from typing import Optional
from flojoy.instruments.tektronix.RSA_API import *  # noqa: F403
from ctypes import cdll, c_int, c_bool, c_double, c_float, byref
from os import path
import numpy as np


@flojoy()
def EXTRACT_SPECTRUM_RSA500(
    input: Optional[DataContainer] = None,
    center_freq: float = 100e6,
    ref_level: float = -30,
    span: float = 1e6,
    bandwidth: float = 10e3,
) -> OrderedPair:
    """Extracts and returns the spectrum trace from an Tektronix RSA.

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
    bandwidth : float, default=10e3
        Resolution bandwidth, in Hz.

    Returns
    -------
    OrderedPair
        RF spectrum trace
    """

    # Connect to RSA
    moved = "C:/Program Files/Tek/RSA_API/lib/x64/RSA_API.dll"
    defau = "C:/Tektronix/RSA_API/lib/x64/RSA_API.dll"
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

    err_check(rsa.DEVICE_Search(byref(numFound), deviceIDs, deviceSerial, deviceType))

    # note: the API can only currently access one at a time
    # Connects to first available
    err_check(rsa.DEVICE_Connect(deviceIDs[0]))
    rsa.CONFIG_Preset()

    # Configure spectrum
    cf = center_freq
    refLevel = ref_level
    rbw = bandwidth

    rsa.SPECTRUM_SetEnable(c_bool(True))
    rsa.CONFIG_SetCenterFreq(c_double(cf))
    rsa.CONFIG_SetReferenceLevel(c_double(refLevel))

    rsa.SPECTRUM_SetDefault()
    specSet = Spectrum_Settings()  # noqa: F405
    rsa.SPECTRUM_GetSettings(byref(specSet))  # noqa: F405
    specSet.window = SpectrumWindows.SpectrumWindow_Kaiser  # noqa: F405
    specSet.verticalUnit = SpectrumVerticalUnits.SpectrumVerticalUnit_dBm  # noqa: F405
    specSet.span = span
    specSet.rbw = rbw
    rsa.SPECTRUM_SetSettings(specSet)
    rsa.SPECTRUM_GetSettings(byref(specSet))

    ready = c_bool(False)
    traceArray = c_float * specSet.traceLength
    traceData = traceArray()
    outTracePoints = c_int(0)
    traceSelector = SpectrumTraces.SpectrumTrace1  # noqa: F405

    # Retrieve spectrum
    rsa.DEVICE_Run()
    rsa.SPECTRUM_AcquireTrace()
    while not ready.value:
        rsa.SPECTRUM_WaitForDataReady(c_int(100), byref(ready))
    rsa.SPECTRUM_GetTrace(
        traceSelector, specSet.traceLength, byref(traceData), byref(outTracePoints)
    )
    rsa.DEVICE_Stop()
    trace = np.array(traceData)

    freq = np.arange(
        specSet.actualStartFreq,
        specSet.actualStartFreq + specSet.actualFreqStepSize * specSet.traceLength,
        specSet.actualFreqStepSize,
    )

    rsa.DEVICE_Disconnect()

    return OrderedPair(x=freq, y=trace)


def err_check(rs):
    if ReturnStatus(rs) != ReturnStatus.noError:  # noqa: F405
        raise RSAError(ReturnStatus(rs).name)  # noqa: F405
