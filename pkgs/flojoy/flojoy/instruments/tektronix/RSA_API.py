"""
Tektronix RSA_API .h file Python Conversion
Author: Morgan Allison
Date created: 5/17
Date edited: 5/17
Windows 7 64-bit
RSA API version 3.9.0029
Python 3.6.0 64-bit (Anaconda 4.3.0)
Download Anaconda: http://continuum.io/downloads
Anaconda includes NumPy and MatPlotLib
Download the RSA_API: http://www.tek.com/model/rsa306-software
Download the RSA_API Documentation:
http://www.tek.com/spectrum-analyzer/rsa306-manual-6

YOU WILL NEED TO REFERENCE THE API DOCUMENTATION
"""

from ctypes import *
from enum import Enum

class RSAError(Exception):
    pass

class ReturnStatus(Enum):
    noError = 0

    # Connection
    errorNotConnected = 101
    errorIncompatibleFirmware = 102
    errorBootLoaderNotRunning = 103
    errorTooManyBootLoadersConnected = 104
    errorRebootFailure = 105

    # POST
    errorPOSTFailureFPGALoad = 201
    errorPOSTFailureHiPower = 202
    errorPOSTFailureI2C = 203
    errorPOSTFailureGPIF = 204
    errorPOSTFailureUsbSpeed = 205
    errorPOSTDiagFailure = 206

    # General Msmt
    errorBufferAllocFailed = 301
    errorParameter = 302
    errorDataNotReady = 304

    # Spectrum
    errorParameterTraceLength = 1101
    errorMeasurementNotEnabled = 1102
    errorSpanIsLessThanRBW = 1103
    errorFrequencyOutOfRange = 1104

    # IF streaming
    errorStreamADCToDiskFileOpen = 1201
    errorStreamADCToDiskAlreadyStreaming = 1202
    errorStreamADCToDiskBadPath = 1203
    errorStreamADCToDiskThreadFailure = 1204
    errorStreamedFileInvalidHeader = 1205
    errorStreamedFileOpenFailure = 1206
    errorStreamingOperationNotSupported = 1207
    errorStreamingFastForwardTimeInvalid = 1208
    errorStreamingInvalidParameters = 1209
    errorStreamingEOF = 1210

    # IQ streaming
    errorIQStreamInvalidFileDataType = 1301
    errorIQStreamFileOpenFailed = 1302
    errorIQStreamBandwidthOutOfRange = 1303

    # -----------------
    # Internal errors
    # -----------------
    errorTimeout = 3001
    errorTransfer = 3002
    errorFileOpen = 3003
    errorFailed = 3004
    errorCRC = 3005
    errorChangeToFlashMode = 3006
    errorChangeToRunMode = 3007
    errorDSPLError = 3008
    errorLOLockFailure = 3009
    errorExternalReferenceNotEnabled = 3010
    errorLogFailure = 3011
    errorRegisterIO = 3012
    errorFileRead = 3013

    errorDisconnectedDeviceRemoved = 3101
    errorDisconnectedDeviceNodeChangedAndRemoved = 3102
    errorDisconnectedTimeoutWaitingForADcData = 3103
    errorDisconnectedIOBeginTransfer = 3104
    errorOperationNotSupportedInSimMode = 3015

    errorFPGAConfigureFailure = 3201
    errorCalCWNormFailure = 3202
    errorSystemAppDataDirectory = 3203
    errorFileCreateMRU = 3204
    errorDeleteUnsuitableCachePath = 3205
    errorUnableToSetFilePermissions = 3206
    errorCreateCachePath = 3207
    errorCreateCachePathBoost = 3208
    errorCreateCachePathStd = 3209
    errorCreateCachePathGen = 3210
    errorBufferLengthTooSmall = 3211
    errorRemoveCachePath = 3212
    errorGetCachingDirectoryBoost = 3213
    errorGetCachingDirectoryStd = 3214
    errorGetCachingDirectoryGen = 3215
    errorInconsistentFileSystem = 3216

    errorWriteCalConfigHeader = 3301
    errorWriteCalConfigData = 3302
    errorReadCalConfigHeader = 3303
    errorReadCalConfigData = 3304
    errorEraseCalConfig = 3305
    errorCalConfigFileSize = 3306
    errorInvalidCalibConstantFileFormat = 3307
    errorMismatchCalibConstantsSize = 3308
    errorCalConfigInvalid = 3309

    # flash
    errorFlashFileSystemUnexpectedSize = 3401,
    errorFlashFileSystemNotMounted = 3402
    errorFlashFileSystemOutOfRange = 3403
    errorFlashFileSystemIndexNotFound = 3404
    errorFlashFileSystemReadErrorCRC = 3405
    errorFlashFileSystemReadFileMissing = 3406
    errorFlashFileSystemCreateCacheIndex = 3407
    errorFlashFileSystemCreateCachedDataFile = 3408
    errorFlashFileSystemUnsupportedFileSize = 3409
    errorFlashFileSystemInsufficentSpace = 3410
    errorFlashFileSystemInconsistentState = 3411
    errorFlashFileSystemTooManyFiles = 3412
    errorFlashFileSystemImportFileNotFound = 3413
    errorFlashFileSystemImportFileReadError = 3414
    errorFlashFileSystemImportFileError = 3415
    errorFlashFileSystemFileNotFoundError = 3416
    errorFlashFileSystemReadBufferTooSmall = 3417
    errorFlashWriteFailure = 3418
    errorFlashReadFailure = 3419
    errorFlashFileSystemBadArgument = 3420
    errorFlashFileSystemCreateFile = 3421

    # Aux monitoring
    errorMonitoringNotSupported = 3501,
    errorAuxDataNotAvailable = 3502

    # battery
    errorBatteryCommFailure = 3601
    errorBatteryChargerCommFailure = 3602
    errorBatteryNotPresent = 3603

    # EST
    errorESTOutputPathFile = 3701
    errorESTPathNotDirectory = 3702
    errorESTPathDoesntExist = 3703
    errorESTUnableToOpenLog = 3704
    errorESTUnableToOpenLimits = 3705

    # Revision information
    errorRevisionDataNotFound = 3801

    # alignment
    error112MHzAlignmentSignalLevelTooLow = 3901
    error10MHzAlignmentSignalLevelTooLow = 3902
    errorInvalidCalConstant = 3903
    errorNormalizationCacheInvalid = 3904
    errorInvalidAlignmentCache = 3905

    # acq status
    errorADCOverrange = 9000  # must not change the location of these error codes without coordinating with MFG TEST
    errorOscUnlock = 9001

    errorNotSupported = 9901

    errorPlaceholder = 9999
    notImplemented = -1


class Cplx32(Structure):
    _fields_ = [('i', c_float), ('q', c_float)]


class CplxInt32(Structure):
    _fields_ = [('i', c_int32), ('q', c_int32)]


class CplxInt16(Structure):
    _fields_ = [('i', c_int16), ('q', c_int16)]


AcqDataStatus_ADC_OVERRANGE = 0x1
AcqDataStatus_REF_OSC_UNLOCK = 0x2
AcqDataStatus_LOW_SUPPLY_VOLTAGE = 0x10
AcqDataStatus_ADC_DATA_LOST = 0x20
AcqDataStatus_VALID_BITS_MASK = (AcqDataStatus_ADC_OVERRANGE or AcqDataStatus_REF_OSC_UNLOCK or AcqDataStatus_LOW_SUPPLY_VOLTAGE or AcqDataStatus_ADC_DATA_LOST)


class AcqDataStatus:
    def __init__(self):
        self.adcOverrange = 0x1
        self.refFreqUnlock = 0x2
        self.lo1Unlock = 0x4
        self.lo2Unlock = 0x8
        self.lowSupplyVoltage = 0x10
        self.adcDataLost = 0x20
        self.event1pps = 0x40
        self.eventTrig1 = 0x80
        self.eventTrig2 = 0x100


DEVSRCH_MAX_NUM_DEVICES = 20
DEVSRCH_SERIAL_MAX_STRLEN = 100
DEVSRCH_TYPE_MAX_STRLEN = 20
DEVINFO_MAX_STRLEN = 100


class DEVICE_INFO(Structure):
    _fields_ = [('nomenclature', c_char_p),
                ('serialNum', c_char_p),
                ('apiVersion', c_char_p),
                ('fwVersion', c_char_p),
                ('fpgaVersion', c_char_p),
                ('hwVersion', c_char_p)]


class TriggerMode:
    def __init__(self):
        self.freeRun = c_int(0)
        self.triggered = c_int(1)
TriggerMode = TriggerMode()


class TriggerSource:
    def __init__(self):
        self.TriggerSourceExternal = c_int(0)
        self.TriggerSourceIFPowerLevel = c_int(1)
TriggerSource = TriggerSource()


class TriggerTransition:
    def __init__(self):
        self.TriggerTransitionLH = c_int(1)
        self.TriggerTransitionHL = c_int(2)
        self.TriggerTransitionEither = c_int(3)
TriggerTransition = TriggerTransition()


DEVEVENT_OVERRANGE = c_int(0)
DEVEVENT_TRIGGER = c_int(1)
DEVEVENT_1PPS = c_int(2)


class RunMode:
    def __init__(self):
        self.stopped = c_int(0)
        self.running = c_int(1)
RunMode = RunMode()


IQBLK_STATUS_INPUT_OVERRANGE = (1 << 0)
IQBLK_STATUS_FREQREF_UNLOCKED = (1 << 1)
IQBLK_STATUS_ACQ_SYS_ERROR = (1 << 2)
IQBLK_STATUS_DATA_XFER_ERROR = (1 << 3)


class IQBLK_ACQINFO(Structure):
    _fields_ = [('sample0Timestamp', c_uint64),
                ('triggerSampleIndex', c_uint64),
                ('triggerTimestamp', c_uint64),
                ('acqStatus', c_uint32)]


class IQHeader(Structure):
    _fields_ = [('acqDataStatus', c_uint16),
                ('acquisitionTimestamp', c_uint64),
                ('frameID', c_uint32),
                ('trigger1Index', c_uint16),
                ('trigger2Index', c_uint16),
                ('timeSyncIndex', c_uint16)]


class SpectrumWindows:
    def __init__(self):
        self.SpectrumWindow_Kaiser = c_int(0)
        self.SpectrumWindow_Mil6dB = c_int(1)
        self.SpectrumWindow_BlackmanHarris = c_int(2)
        self.SpectrumWindow_Rectangle = c_int(3)
        self.SpectrumWindow_FlatTop = c_int(4)
        self.SpectrumWindow_Hann = c_int(5)
SpectrumWindows = SpectrumWindows()


class SpectrumTraces:
    def __init__(self):
        self.SpectrumTrace1 = c_int(0)
        self.SpectrumTrace2 = c_int(1)
        self.SpectrumTrace3 = c_int(2)
SpectrumTraces = SpectrumTraces()


class SpectrumDetectors:
    def __init__(self):
        self.SpectrumDetector_PosPeak = c_int(0)
        self.SpectrumDetector_NegPeak = c_int(1)
        self.SpectrumDetector_AverageVRMS = c_int(2)
        self.SpectrumDetector_Sample = c_int(3)
SpectrumDetectors = SpectrumDetectors()


class SpectrumVerticalUnits:
    def __init__(self):
        self.SpectrumVerticalUnit_dBm = c_int(0)
        self.SpectrumVerticalUnit_Watt = c_int(1)
        self.SpectrumVerticalUnit_Volt = c_int(2)
        self.SpectrumVerticalUnit_Amp = c_int(3)
        self.SpectrumVerticalUnit_dBmV = c_int(4)
SpectrumVerticalUnits = SpectrumVerticalUnits()


class Spectrum_Settings(Structure):
    _fields_ = [('span', c_double),
                ('rbw', c_double),
                ('enableVBW', c_bool),
                ('vbw', c_double),
                ('traceLength', c_int),
                ('window', c_int),
                ('verticalUnit', c_int),
                ('actualStartFreq', c_double),
                ('actualStopFreq', c_double),
                ('actualFreqStepSize', c_double),
                ('actualRBW', c_double),
                ('actualVBW', c_double),
                ('actualNumIQSamples', c_double)]


class Spectrum_Limits(Structure):
    _fields_ = [('maxSpan', c_double),
                ('minSpan', c_double),
                ('maxRBW', c_double),
                ('minRBW', c_double),
                ('maxVBW', c_double),
                ('minVBW', c_double),
                ('maxTraceLength', c_int),
                ('minTraceLength', c_int)]


class Spectrum_TraceInfo(Structure):
    _fields_ = [('timestamp', c_int64),
                ('acqDataStatus', c_uint16)]


class DPX_FrameBuffer(Structure):
    _fields_ = [('fftPerFrame', c_int32),
                ('fftCount', c_int64),
                ('frameCount', c_int64),
                ('timestamp', c_double),
                ('acqDataStatus', c_uint32),
                ('minSigDuration', c_double),
                ('minSigDurOutOfRange', c_bool),
                ('spectrumBitmapWidth', c_int32),
                ('spectrumBitmapHeight', c_int32),
                ('spectrumBitmapSize', c_int32),
                ('spectrumTraceLength', c_int32),
                ('numSpectrumTraces', c_int32),
                ('spectrumEnabled', c_bool),
                ('spectrogramEnabled', c_bool),
                ('spectrumBitmap', POINTER(c_float)),
                ('spectrumTraces', POINTER(POINTER(c_float))),
                ('sogramBitmapWidth', c_int32),
                ('sogramBitmapHeight', c_int32),
                ('sogramBitmapSize', c_int32),
                ('sogramBitmapNumValidLines', c_int32),
                ('sogramBitmap', POINTER(c_uint8)),
                ('sogramBitmapTimestampArray', POINTER(c_double)),
                ('sogramBitmapContainTriggerArray', POINTER(c_double))]


class DPX_SogramSettingStruct(Structure):
    _fields_ = [('bitmapWidth', c_int32),
                ('bitmapHeight', c_int32),
                ('sogramTraceLineTime', c_double),
                ('sogramBitmapLineTime', c_double)]


class DPX_SettingStruct(Structure):
    _fields_ = [('enableSpectrum', c_bool),
                ('enableSpectrogram', c_bool),
                ('bitmapWidth', c_int32),
                ('bitmapHeight', c_int32),
                ('traceLength', c_int32),
                ('decayFactor', c_float),
                ('actualRBW', c_double)]


class TraceType:
    def __init__(self):
        self.TraceTypeAverage = c_int(0)
        self.TraceTypeMax = c_int(1)
        self.TraceTypeMaxHold = c_int(2)
        self.TraceTypeMin = c_int(3)
        self.TraceTypeMinHold = c_int(4)
TraceType = TraceType()


class VerticalUnitType:
    def __init__(self):
        self.VerticalUnit_dBm = c_int(0)
        self.VerticalUnit_Watt = c_int(1)
        self.VerticalUnit_Volt = c_int(2)
        self.VerticalUnit_Amp = c_int(3)
VerticalUnitType = VerticalUnitType()


DPX_TRACEIDX_1 = c_int(0)
DPX_TRACEIDX_2 = c_int(1)
DPX_TRACEIDX_3 = c_int(2)


class AudioDemodMode:
    def __init__(self):
        self.ADM_FM_8KHZ = c_int(0)
        self.ADM_FM_13KHZ = c_int(1)
        self.ADM_FM_75KHZ = c_int(2)
        self.ADM_FM_200KHZ = c_int(3)
        self.ADM_AM_8KHZ = c_int(4)
        self.ADM_NONE = c_int(5)  # internal use only
AudioDemodMode = AudioDemodMode()


class StreamingMode:
    def __init__(self):
        self.StreamingModeRaw = c_int(0)
        self.StreamingModeFormatted = c_int(1)
StreamingMode = StreamingMode()


class IQSOUTDEST:
    def __init__(self):
        self.IQSOD_CLIENT = c_int(0)
        self.IQSOD_FILE_TIQ = c_int(1)
        self.IQSOD_FILE_SIQ = c_int(2)
        self.IQSOD_FILE_SIQ_SPLIT = c_int(3)
IQSOUTDEST = IQSOUTDEST()


class IQSOUTDTYPE:
    def __init__(self):
        self.IQSODT_SINGLE = c_int(0)
        self.IQSODT_INT32 = c_int(1)
        self.IQSODT_INT16 = c_int(2)
IQSOUTDTYPE = IQSOUTDTYPE()


IQSSDFN_SUFFIX_INCRINDEX_MIN = c_int(0)
IQSSDFN_SUFFIX_TIMESTAMP = c_int(-1)
IQSSDFN_SUFFIX_NONE = c_int(-2)

IFSSDFN_SUFFIX_INCRINDEX_MIN = c_int(0)
IFSSDFN_SUFFIX_TIMESTAMP = c_int(-1)
IFSSDFN_SUFFIX_NONE = c_int(-2)

IQSTRM_STATUS_OVERRANGE = (1 << 0)
IQSTRM_STATUS_XFER_DISCONTINUITY = (1 << 1)
IQSTRM_STATUS_IBUFF75PCT = (1 << 2)
IQSTRM_STATUS_IBUFFOVFLOW = (1 << 3)
IQSTRM_STATUS_OBUFF75PCT = (1 << 4)
IQSTRM_STATUS_OBUFFOVFLOW = (1 << 5)
IQSTRM_STATUS_NONSTICKY_SHIFT = 0
IQSTRM_STATUS_STICKY_SHIFT = 16

IQSTRM_MAXTRIGGERS = 100



class IQSTRMIQINFO(Structure):
    _fields_ = [('timestamp', c_uint64),
                ('triggerCount', c_int),
                ('triggerIndices', POINTER(c_int)),
                ('scaleFactor', c_double),
                ('acqStatus', c_uint32)]


class IQSTREAM_File_Info(Structure):
    _fields_ = [('numberSamples', c_uint64),
                ('sample0Timestamp', c_uint64),
                ('triggerSampleIndex', c_uint64),
                ('triggerTimestamp', c_uint64),
                ('acqStatus', c_uint32),
                ('filenames', c_wchar_p)]


class GNSS_SATSYS:
    def __init__(self):
        self.GNSS_NOSYS = c_int(0)
        self.GNSS_GPS_GLONASS = c_int(1)
        self.GNSS_GPS_BEIDOU = c_int(2)
        self.GNSS_GPS = c_int(3)
        self.GNSS_GLONASS = c_int(4)
        self.GNSS_BEIDOU = c_int(5)
GNSS_SATSYS = GNSS_SATSYS()


class POWER_INFO(Structure):
    _fields_ = [('externalPowerPresent', c_bool),
                ('batteryPresent', c_bool),
                ('batteryChargeLevel', c_double),
                ('batteryCharging', c_bool),
                ('batteryOverTemperature', c_bool),
                ('batteryHardwareError', c_bool)]
