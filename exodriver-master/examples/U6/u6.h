//Author: LabJack
//April 8, 2016
//Header for U6 example helper functions.

#ifndef _U6_H
#define _U6_H

#include <sys/time.h>
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include "labjackusb.h"


#ifdef __cplusplus
extern "C"{
#endif

typedef unsigned char uint8;
typedef unsigned short uint16;
typedef unsigned int uint32;

//Structure for storing calibration constants
struct U6_CALIBRATION_INFORMATION {
    uint8 prodID;
    uint8 hiRes;
    double ccConstants[40];
    /*
    Calibration constants order
    0 - AIN +-10V Slope, GainIndex=0
    1 - AIN +-10V Offset, GainIndex=0
    2 - AIN +-1V Slope, GainIndex=1
    3 - AIN +-1V Offset, GainIndex=1
    4 - AIN +-100mV Slope, GainIndex=2
    5 - AIN +-100mV Offset, GainIndex=2
    6 - AIN +-10mV Slope, GainIndex=3
    7 - AIN +-10mV Offset, GainIndex=3
    8 - AIN +-10V Neg. Slope, GainIndex=0
    9 - AIN +-10V Center Pt., GainIndex=0
    10 - AIN +-1V Neg. Slope, GainIndex=1
    11 - AIN +-1V Center Pt., GainIndex=1
    12 - AIN +-100mV Neg. Slope, GainIndex=2
    13 - AIN +-100mV Center Pt., GainIndex=2
    14 - AIN +-10mV Neg. Slope, GainIndex=3
    15 - AIN +-10mV Center Pt., GainIndex=3
    16 - DAC0 Slope
    17 - DAC0 Offset
    18 - DAC1 Slope
    19 - DAC1 Offset
    20 - Current Output 0
    21 - Current Output 1
    22 - Temperature Slope
    23 - Temperature Offset

    High Resolution
    24 - AIN +-10V Slope, GainIndex=0
    25 - AIN +-10V Offset, GainIndex=0
    26 - AIN +-1V Slope, GainIndex=1
    27 - AIN +-1V Offset, GainIndex=1
    28 - AIN +-100mV Slope, GainIndex=2
    29 - AIN +-100mV Offset, GainIndex=2
    30 - AIN +-10mV Slope, GainIndex=3
    31 - AIN +-10mV Offset, GainIndex=3
    32 - AIN +-10V Neg. Slope, GainIndex=0
    33 - AIN +-10V Center Pt., GainIndex=0
    34 - AIN +-1V Neg. Slope, GainIndex=1
    35 - AIN +-1V Center Pt., GainIndex=1
    36 - AIN +-100mV Neg. Slope, GainIndex=2
    37 - AIN +-100mV Center Pt., GainIndex=2
    38 - AIN +-10mV Neg. Slope, GainIndex=3
    39 - AIN +-10mV Center Pt., GainIndex=3
    */

};

typedef struct U6_CALIBRATION_INFORMATION u6CalibrationInfo;

//Structure for storing LJTDAC calibration constants
struct U6_TDAC_CALIBRATION_INFORMATION{
    uint8 prodID;
    double ccConstants[4];
    /*
    DAC Calibration constants order
    0 - SlopeA;
    1 - OffsetA;
    2 - SlopeB;
    3 - OffsetB;
    */
};

typedef struct U6_TDAC_CALIBRATION_INFORMATION u6TdacCalibrationInfo;


/* Functions */

void normalChecksum( uint8 *b,
                     int n);
//Adds checksum to a data packet for normal command format.
//b = data packet for normal command
//n = size of data packet

void extendedChecksum( uint8 *b,
                       int n);
//Adds checksum to a data packet for extended command format.
//b = data packet for extended command
//n = size of data packet

uint8 normalChecksum8( uint8 *b,
                       int n);
//Returns the Checksum8 for a normal command data packet.
//b = data packet for normal command
//n = size of data packet

uint16 extendedChecksum16( uint8 *b,
                           int n);
//Returns the Checksum16 for a extended command data packet.
//b = data packet for extended command
//n = size of data packet

uint8 extendedChecksum8( uint8 *b);
//Returns the Checksum8 for a extended command data packet.
//b = data packet for extended command

HANDLE openUSBConnection( int localID);
//Opens a U6 connection over USB.  Returns NULL on failure, or a HANDLE
//on success.
//localID = the local ID or serial number of the U6 you want to open

void closeUSBConnection( HANDLE hDevice);
//Closes a HANDLE to a U6 device.

long getTickCount( void);
//Returns the number of milliseconds that has elasped since the system was
//started.

long getCalibrationInfo( HANDLE hDevice,
                         u6CalibrationInfo *caliInfo);
//Gets calibration information from memory blocks 0-10 of a U6.  Returns the
//calibration information in a calibrationInfo structure.
//hDevice = handle to a U6 device
//caliInfo = structure where calibrarion information will be stored

long getTdacCalibrationInfo( HANDLE hDevice,
                             u6TdacCalibrationInfo *caliInfo,
                             uint8 DIOAPinNum);
//Gets calibration information from the EEPROM of a LJTick-DAC (LJTDAC).
//Returns the calibration information in a u6TdacCalibrationInfo structure.
//hDevice = handle to a U6 device
//caliInfo = structure where LJTDAC calibration information will be stored
//DIOAPinNum = The U6 digital IO line where the LJTDAC DIOA pin is connected.
//             The DIOB pin is assumed to be the next digital IO line.

double FPuint8ArrayToFPDouble( uint8 *buffer,
                               int startIndex);
//Converts a fixed point byte array (starting a startIndex) to a floating point
//double value.  This function is used primarily by getCalibrationInfo.

long isCalibrationInfoValid( u6CalibrationInfo *caliInfo);
//Performs a simple check to determine if the caliInfo struct was set up by
//getCalibrationInfo.  Returns 0 if caliInfo is not valid, or 1 if it is.
//caliInfo = structure where calibrarion information is stored

long isTdacCalibrationInfoValid( u6TdacCalibrationInfo *caliInfo);
//Performs a simple check to determine if the caliInfo struct was set up by
//getTdacCalibrationInfo.  Returns 0 if caliInfo is not valid, or 1 if it is.
//caliInfo = structure where LJTDAC calibration information is stored

long getAinVoltCalibrated( u6CalibrationInfo *caliInfo,
                           int resolutionIndex,
                           int gainIndex,
                           int bits24,
                           uint32 bytesVolt,
                           double *analogVolt);
//Translates the binary AIN reading from the U6 to a voltage value (calibrated)
//in Volts.  Call getCalibrationInfo first to set up caliInfo.  Returns -1 on
//error, 0 on success.
//caliInfo = structure where calibrarion information is stored
//resolutionIndex = The resolution index used when read the binary AIN voltage.
//                  0=default, 1-8 for high speed ADC, 9-13 for higres ADC (U6-Pro).
//gainIndex = The gain index used when reading the binary AIN voltage.
//            0 = +-10V, 1 = +-1V, 2 = +-100mV, 3 = +-10mV
//bits24 = Indicates if the voltage bytes passed is a 24-bit binary value, 
//         otherwise considered to be 16-bits.
//bytesVolt = The binary voltage that will be converted.  Can be a 16 or 24 bit
//            value.
//analogVolt = The converted analog voltage.

long getDacBinVoltCalibrated8Bit( u6CalibrationInfo *caliInfo,
                                  int dacNumber,
                                  double analogVolt,
                                  uint8 *bytesVolt8);
//Translates an analog output voltage value (Volts) to a binary 8 bit value
//(calibrated) that can be sent to a U6.  Call getCalibrationInfo first to set
//up caliInfo.  Returns -1 on error, 0 on success.
//caliInfo = Structure where calibrarion information is stored
//dacNumber = Channel number of the DAC.
//analogVolt = The analog voltage that will be converted.
//bytesVolt8 = The converted binary 8 bit value.

long getDacBinVoltCalibrated16Bit( u6CalibrationInfo *caliInfo,
                                   int dacNumber,
                                   double analogVolt,
                                   uint16 *bytesVolt16);
//Translates a analog output voltage value (Volts) to a binary 16 bit value
//(calibrated) that can be sent to a U6. Call getCalibrationInfo first to set
//up caliInfo.  Returns -1 on error, 0 on success.
//caliInfo = Structure where calibrarion information is stored.
//dacNumber = Channel number of the DAC.
//analogVolt = The analog voltage that will be converted.
//bytesVolt16 = The converted binary 16 bit value.

long getTempKCalibrated( u6CalibrationInfo *caliInfo,
                         int resolutionIndex,
                         int gainIndex,
                         int bits24,
                         uint32 bytesTemp,
                         double *kelvinTemp);
//Translates the binary reading from the U6 to a temperature value
//(calibrated) in Kelvin.  Call getCalibrationInfo first to set up caliInfo.
//Returns -1 on error, 0 on success.
//caliInfo = Structure where calibration information is stored.
//resolutionIndex = The resolution index used when reading the temperature.
//                  0=default, 1-8 for high speed ADC, 9-13 for higres ADC (U6-Pro).
//gainIndex = The gain index used when reading the temperature.
//            0 = +-10V, 1 = +-1V, 2 = +-100mV, 3 = +-10mV
//bits24 = Indicates if the temperature bytes passed is a 24-bit value value,
//         otherwise considered to be 16-bits.
//bytesTemp = The binary temperature that will be converted.  Can be a 16 or 24 bit
//            value.
//kelvinTemp = The converted Kelvins temperature.

long getTdacBinVoltCalibrated( u6TdacCalibrationInfo *caliInfo,
                               int dacNumber,
                               double analogVolt,
                               uint16 *bytesVolt);
//Translates a voltage value (Volts) to binary analog input bytes (calibrated)
//that can be sent to a LJTick-DAC (LJTDAC).  Call getLJTDACCalibrationInfo
//first to set up caliInfo.  Returns -1 on error, 0 on success.
//caliInfo = Structure where LJTDAC calibrarion information is stored.
//dacNumber = Channel number of the DAC (0 = DACA, 1 = DACB).
//analogVoltage = The analog voltage that will be converted.
//bytesVoltage = The converted 2 byte voltage.

long getAinVoltUncalibrated( int resolutionIndex,
                             int gainIndex,
                             int bits24,
                             uint32 bytesVolt,
                             double *analogVolt);
//Translates the binary AIN reading from the U6 to a voltage value
//(uncalibrated) in Volts.  Returns -1 on error, 0 on success.
//resolutionIndex = The resolution index used when read the binary AIN voltage.
//                  0=default, 1-8 for high speed ADC, 9-13 for higres ADC (U6-Pro).
//gainIndex,= The gain index used when reading the binary AIN voltage.
//            0 = +-10V, 1 = +-1V, 2 = +-100mV, 3 = +-10mV
//bits24,= Indicates if the voltage bytes passed is a 24-bit binary value,
//         otherwise considered to be 16-bits.
//bytesVolt = The binary voltage that will be converted.  Can be a 16 or 24 bit
//            value.
//analogVolt = The converted analog voltage.

long getDacBinVoltUncalibrated8Bit( int dacNumber,
                                    double analogVolt,
                                    uint8 *bytesVolt8);
//Translates a DAC voltage value (Volts) to a binary 8 bit value (uncalibrated)
//that can be sent to a U6.  Returns -1 on error, 0 on success.
//dacNumber = Channel number of the DAC.
//analogVolt = The analog voltage that will be converted.
//bytesVolt = The converted binary 8 bit value.

long getDacBinVoltUncalibrated16Bit( int dacNumber,
                                     double analogVolt,
                                     uint16 *bytesVolt16);
//Translates a DAC voltage value (Volts) to a binary 16 bit value
//(uncalibrated) that can be sent to a U6.  Returns -1 on error, 0 on
//success.
//dacNumber = Channel number of the DAC.
//analogVolt = The analog voltage that needs to be converted.
//bytesVolt = The converted binary 16 bit value.

long getTempKUncalibrated( int resolutionIndex,
                           int gainIndex,
                           int bits24,
                           uint32 bytesTemp,
                           double *kelvinTemp);
//Translates the binary reading from the U6, to a temperature value
//(uncalibrated) in Kelvin.
//Returns -1 on error, 0 on success.
//resolutionIndex = The resolution index used when reading the temperature.
//                  0=default, 1-8 for high speed ADC, 9-13 for higres ADC (U6-Pro).
//gainIndex = The gain index used when reading the temperature.
//            0 = +-10V, 1 = +-1V, 2 = +-100mV, 3 = +-10mV
//bits24 = Indicates if the temperature bytes passed is a 24-bit value value,
//         otherwise considered to be 16-bits.
//bytesTemp = the 2 byte binary temperature that will be converted.
//kelvinTemp = the converted Kelvins temperature

long I2C( HANDLE hDevice,
          uint8 I2COptions,
          uint8 SpeedAdjust,
          uint8 SDAPinNum,
          uint8 SCLPinNum,
          uint8 Address,
          uint8 NumI2CBytesToSend,
          uint8 NumI2CBytesToReceive,
          uint8 *I2CBytesCommand,
          uint8 *Errorcode,
          uint8 *AckArray,
          uint8 *I2CBytesResponse);
//This function will perform the I2C low-level function call.  Please refer to
//section 5.3.19 of the U6 User's Guide for parameter documentation.  Returns
//-1 on error, 0 on success.
//hDevice = handle to a U6 device
//I2COptions = byte 6 of the command
//SpeedAdjust = byte 7 of the command
//SDAPinNum = byte 8 of the command
//SCLPinNum = byte 9 of the command
//Address = byte 10 of the command
//NumI2CBytesToSend = byte 12 of the command
//NumI2CBytesToReceive = byte 13 of the command
//*I2CBytesCommand = Array that holds bytes 14 and above of the command.  Needs
//                   to be at least NumI2CBytesToSend elements in size.
//*Errorcode = returns byte 6 of the response
//*AckArray = Array that returns bytes 8 - 11 of the response.  Needs to be at
//            least 4 elements in size.
//*I2CBytesResponse = Array that returns bytes 12 and above of the response.
//                    Needs to be at least NumI2CBytesToReceive elements in
//                    size.


/* Easy Functions (Similar to the easy functions in the UD driver for Windows) */

long eAIN( HANDLE Handle,
           u6CalibrationInfo *CalibrationInfo,
           long ChannelP,
           long ChannelN,
           double *Voltage,
           long Range,
           long Resolution,
           long Settling,
           long Binary,
           long Reserved1,
           long Reserved2);
//An "easy" function that returns a reading from one analog input.  Returns 0
//for no error, or -1 or >0 value (low-level errorcode) on error.
//Call getCalibrationInfo first to set up CalibrationInfo.
//Handle = Handle to a U6 device.
//CalibrationInfo = Structure where calibration information is stored.
//ChannelP = The positive AIN channel to acquire.
//ChannelN = The negative AIN channel to acquire. For differential readings,
//           this should be ChannelP+1. For single-ended readings, this
//           parameter should be 0 or 15
//Voltage = Returns the analog input reading, which is generally a voltage.
//Range = Pass a range constant.
//Resolution = Pass a resolution index.
//Settling = Pass a settling factor.
//Binary = If this is nonzero (True), the Voltage parameter will return the raw
//         binary value.
//Reserved (1&2) = Pass 0.


long eDAC( HANDLE Handle,
           u6CalibrationInfo *CalibrationInfo,
           long Channel,
           double Voltage,
           long Binary,
           long Reserved1,
           long Reserved2);
//An "easy" function that writes a value to one analog output.  Returns 0 for
//no error, or -1 or >0 value (low-level errorcode) on error.
//Call getCalibrationInfo first to set up CalibrationInfo.
//Handle = Handle to a U6 device.
//CalibrationInfo = Structure where calibrarion information is stored
//Channel = The analog output channel to write to.
//Voltage = The voltage to write to the analog output.
//Binary = If this is nonzero (True), the value passed for Voltage should be
//         binary.
//Reserved (1&2) = Pass 0.

long eDI( HANDLE Handle,
          long Channel,
          long *State);
//An "easy" function that reads the state of one digital input.  Returns 0 for
//no error, or -1 or >0 value (low-level errorcode) on error.
//Handle = Handle to a U6 device.
//Channel = The channel to read.  0-19 corresponds to FIO0-CIO3.
//State = Returns the state of the digital input.  0=False=Low and 1=True=High.

long eDO( HANDLE Handle,
          long Channel,
          long State);
//An "easy" function that writes the state of one digital output.  This
//function does not automatically configure the specified channel as digital,
//unless ConfigIO is set as True.  Returns 0 for no error, or -1 or >0 value
//(low-level errorcode) on error.
//Handle = Handle to a U6 device.
//Channel = The channel to write to.  0-19 corresponds to FIO0-CIO3.
//State = The state to write to the digital output.  0=False=Low and
//        1=True=High.

long eTCConfig( HANDLE Handle,
                long *aEnableTimers,
                long *aEnableCounters,
                long TCPinOffset,
                long TimerClockBaseIndex,
                long TimerClockDivisor,
                long *aTimerModes,
                double *aTimerValues,
                long Reserved1,
                long Reserved2);
//An "easy" function that configures and initializes all the timers and
//counters.  When needed, this function automatically configures the needed
//lines as digital.  Returns 0 for no error, or -1 or >0 value (low-level
//errorcode) on error.
//Handle = Handle to a U6 device.
//aEnableTimers = An array where each element specifies whether that timer is
//                enabled.  Timers must be enabled in order starting from 0, so
//                for instance, Timer1 cannot be enabled without enabling Timer
//                0 also.  A nonzero for an array element specifies to enable
//                that timer.  For the U6, this array must always have at least
//                4 elements.
//aEnableCounters = An array where each element specifies whether that counter
//                  is enabled.  Counters do not have to be enabled in order
//                  starting from 0, so Counter1 can be enabled when Counter0
//                  is disabled.  A nonzero value for an array element
//                  specifies to enable that counter.  For the U6, this array
//                  must always have at least 2 elements.
//TCPinOffset = Value from 0-8 specifies where to start assigning timers and
//              counters.
//TimerClockBaseIndex = Pass a constant to set the timer base clock.  The
//                      default is LJ_tc48MHZ.
//TimerClockDivisor = Pass a divisor from 0-255 where 0 is a divisor of 256.
//aTimerModes = An array where each element is a constant specifying the mode
//              for that timer.  For the U6, this array must always have at
//              least 4 elements.
//aTimerValues = An array where each element specifies the initial value for
//               that timer.  For the U6, this array must always have at least
//               2 elements.
//Reserved (1&2) =  Pass 0.

long eTCValues( HANDLE Handle,
                long *aReadTimers,
                long *aUpdateResetTimers,
                long *aReadCounters,
                long *aResetCounters,
                double *aTimerValues,
                double *aCounterValues,
                long Reserved1,
                long Reserved2);
//An "easy" function that updates and reads all the timers and counters.
//Returns 0 for no error, or -1 or >0 value (low-level errorcode) on error.
//Handle = Handle to a U6 device.
//aReadTimers = An array where each element specifies whether to read that
//              timer.  A nonzero value for an array element specifies to read
//              that timer.  For the U6, this array must always have at least 4
//              elements.
//aUpdateResetTimers = An array where each element specifies whether to
//                     update/reset that timers.  A nonzero value for an array
//                     element specifies to update/reset that timer.  For the
//                     U6, this array must always have at least 4 elements.
//aReadCounters = An array where each element specifies whether to read that
//                counter.  A nonzero value for an array element specifies to
//                read that counter.  For the U6, this array must always have
//                at least 2 elements.
//aResetCounters = An array where each element specifies whether to reset that
//                 counter.  A nonzero value for an array element specifies to
//                 reset that counter.  For the U6, this array must always have
//                 at least 2 elements.
//aTimerValues = Input: An array where each element is the new value for that
//               timer.  Each value is only updated if the appropriate element
//               is set in the aUpdateResetTimers array.
//               Output: An array where each element is the value read from
//               that timer if the appropriate element is set in the
//               aReadTimers array.  If the timer mode set for the timer is
//               Quadrature Input, the value needs to be converted from an
//               unsigned 32-bit integer to a signed 32-bit integer (2’s
//               complement).  For the U6, this array must always have at least
//               4 elements.
//aCounterValues = An array where each element is the value read from that
//                 counter if the appropriate element is set in the aReadTimers
//                 array.  For the U6, this array must always have at least 2
//                 elements.
//Reserved (1&2) = Pass 0.


/* Easy Function Helpers */

long ehConfigIO( HANDLE hDevice,
                 uint8 inWriteMask,
                 uint8 inNumberTimersEnabled,
                 uint8 inCounterEnable,
                 uint8 inPinOffset,
                 uint8 *outNumberTimersEnabled,
                 uint8 *outCounterEnable,
                 uint8 *outPinOffset);
//Used by the eTCConfig easy functions.  This function takes the ConfigIO
//low-level command and response bytes (not including checksum and command
//bytes) as its parameter and performs a ConfigIO call with the U6.  Returns
//-1 or errorcode (>1 value) on error, 0 on success.

long ehConfigTimerClock( HANDLE hDevice,
                         uint8 inTimerClockConfig,
                         uint8 inTimerClockDivisor,
                         uint8 *outTimerClockConfig,
                         uint8 *outTimerClockDivisor);
//Used by the eTCConfig easy function.  This function takes the
//ConfigTimerClock low-level command and response bytes (not including checksum
//and command bytes) as its parameter and performs a ConfigTimerClock call with
//the U6.  Returns -1 or errorcode (>1 value) on error, 0 on success.

long ehFeedback( HANDLE hDevice,
                 uint8 *inIOTypesDataBuff,
                 long inIOTypesDataSize,
                 uint8 *outErrorcode,
                 uint8 *outErrorFrame,
                 uint8 *outDataBuff,
                 long outDataSize);
//Used by the all of the easy functions.  This function takes the Feedback
//low-level command and response bytes (not including checksum and command
//bytes) as its parameter and performs a Feedback call with the U6.  Returns -1
//or errorcode (>1 value) on error, 0 on success.


/* Easy function constants */

// ranges:
#define LJ_rgAUTO       0
#define LJ_rgBIP10V     2 // -10V to +10V
#define LJ_rgBIP1V      8 // -1V to +1V
#define LJ_rgBIPP1V     10 // -0.1V to +0.1V
#define LJ_rgBIPP01V    11 // -0.01V to +0.01V


// timer clocks:
#define LJ_tc4MHZ       20
#define LJ_tc12MHZ      21
#define LJ_tc48MHZ      22
#define LJ_tc1MHZ_DIV   23
#define LJ_tc4MHZ_DIV   24
#define LJ_tc12MHZ_DIV  25
#define LJ_tc48MHZ_DIV  26

// timer modes:
#define LJ_tmPWM16                  0 // 16 bit PWM
#define LJ_tmPWM8                   1 // 8 bit PWM
#define LJ_tmRISINGEDGES32          2 // 32-bit rising to rising edge measurement
#define LJ_tmFALLINGEDGES32         3 // 32-bit falling to falling edge measurement
#define LJ_tmDUTYCYCLE              4 // duty cycle measurement
#define LJ_tmFIRMCOUNTER            5 // firmware based rising edge counter
#define LJ_tmFIRMCOUNTERDEBOUNCE    6 // firmware counter with debounce
#define LJ_tmFREQOUT                7 // frequency output
#define LJ_tmQUAD                   8 // Quadrature
#define LJ_tmTIMERSTOP              9 // stops another timer after n pulses
#define LJ_tmSYSTIMERLOW            10 // read lower 32-bits of system timer
#define LJ_tmSYSTIMERHIGH           11 // read upper 32-bits of system timer
#define LJ_tmRISINGEDGES16          12 // 16-bit rising to rising edge measurement
#define LJ_tmFALLINGEDGES16         13 // 16-bit falling to falling edge measurement

#ifdef __cplusplus
}
#endif

#endif
