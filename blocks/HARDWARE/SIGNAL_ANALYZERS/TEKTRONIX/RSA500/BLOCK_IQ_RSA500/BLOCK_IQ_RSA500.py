from flojoy import flojoy, DataContainer, OrderedPair, File
from typing import Optional, TypedDict
from flojoy.instruments.tektronix.RSA_API import *  # noqa: F403
from ctypes import cdll, c_int, c_bool, c_double, c_float, byref
from os import path
import numpy as np


class IQSplitOutput(TypedDict):
    I_real: OrderedPair
    Q_imag: OrderedPair


@flojoy
def BLOCK_IQ_RSA500(
    dll_file: File,
    input: Optional[DataContainer] = None,
    center_freq: float = 100e6,
    ref_level: float = -30,
    record_length: float = 1e3,
    bandwidth: float = 5e5,
) -> IQSplitOutput:
    """Extract Block IQ measurement from a Tektronix RSA.

    This block should also work with compatible Tektronix RSAXXX instruments.

    Tested with RSA507a.

    Parameters
    ----------
    dll_file : File, default=C:/Tektronix/RSA_API/lib/x64/RSA_API.dll
        Where the RSA_API.dll file is located.
    center_freq : float, default=100e6
        The center frequency, in Hz.
    ref_level : float, default=-30
        The reference level (the maximum y axis value), in dBm.
    record_length : float, default=1e3
        The length to record (length of x axis), in ms.
    bandwidth : float, default=5e5
        Resolution bandwidth, in Hz.

    Returns
    -------
    I_real: OrderedPair
        x: time
        y: power
    Q_imag: OrderedPair
        x: time
        y: power
    """

    # Connect to RSA
    rsa = cdll.LoadLibrary(dll_file.unwrap())

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
    iq_bw = bandwidth
    record_length
    record_length = int(record_length)
    rsa.CONFIG_SetCenterFreq(c_double(cf))
    rsa.CONFIG_SetReferenceLevel(c_double(refLevel))
    rsa.IQBLK_SetIQBandwidth(c_double(iq_bw))
    rsa.IQBLK_SetIQRecordLength(c_int(record_length))

    # Create array of time data for plotting IQ vs time
    iqSampleRate = c_double(0)
    rsa.IQBLK_GetIQSampleRate(byref(iqSampleRate))
    time = np.linspace(0, record_length / iqSampleRate.value, record_length)

    # Acquire data
    record_length = int(record_length)
    ready = c_bool(False)
    iqArray = c_float * record_length
    iData = iqArray()
    qData = iqArray()
    outLength = 0
    rsa.DEVICE_Run()
    rsa.IQBLK_AcquireIQData()
    while not ready.value:
        rsa.IQBLK_WaitForIQDataReady(c_int(100), byref(ready))
    rsa.IQBLK_GetIQDataDeinterleaved(
        byref(iData), byref(qData), byref(c_int(outLength)), c_int(record_length)
    )
    rsa.DEVICE_Stop()
    rsa.DEVICE_Disconnect()

    return IQSplitOutput(
        I_real=OrderedPair(x=time, y=np.array(iData)),
        Q_imag=OrderedPair(x=time, y=np.array(qData)),
    )


def err_check(rs):
    if ReturnStatus(rs) != ReturnStatus.noError:  # noqa: F405
        raise RSAError(ReturnStatus(rs).name)  # noqa: F405
