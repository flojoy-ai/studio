//Author: LabJack
//April 8, 2016
//Header for UE9 example helper functions.
//
//History
//-Added easy functions.
//-Added I2C function and LJTDAC functions and structure. (09/04/2007)
//-Fixed memory leak issue in I2C functions. (09/27/2007)
//-Fixed a bug in ehDIO_Feedback where CIO and MIO states were only being
// set. (08/08/2008)
//-Modified calibration constants structs.  Modified the names and code of the
// functions that apply the calibration constants. (06/25/2009)
//-Replaced LJUSB_BulkWrite/Read with LJUSB_write/Read calls.  Added serial
// support to openUSBConnection. (05/25/2011)
//-Updated functions to have C bindings. (04/08/2016) 

#ifndef _UE9_H
#define _UE9_H

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
struct UE9_CALIBRATION_INFORMATION {
    uint8 prodID;
    double ccConstants[25];
    /*
    Calibration constants order
    0 - Slope, Ini G = 1
    1 - Offset, Ini G = 1
    2 - Slope, Ini G = 2
    3 - Offset, Ini G = 2
    4 - Slope, Ini G = 4
    5 - Offset, Ini G = 4
    6 - Slope, Ini G = 8
    7 - Offset. Ini G = 8
    8 - Slope, Bi G = 1
    9 - Offset, Bi G = 1
    10 - Slope, DAC0
    11 - Offset, DAC0
    12 - Slope, DAC1
    13 - Offset, DAC1
    14 - Slope, Temp (133/141)
    15 - Slope, Temp (133/141, Low)
    16 - Cal Temp
    17 - Vref
    18 - Reserved
    19 - Vref/2
    20 - Slope, Vs (132/140)

    //Hi-Res ADC
    21 - Slope, Ini G = 8
    22 - Offset. Ini G = 8
    23 - Slope, Bi G = 1
    24 - Offset, Bi G = 1
    */
};

typedef struct UE9_CALIBRATION_INFORMATION ue9CalibrationInfo;

//Structure for storing LJTDAC calibration constants
struct UE9_TDAC_CALIBRATION_INFORMATION {
    uint8 prodID;
    double ccConstants[4];
    /*
    Calibration constants order
    0 - SlopeA;
    1 - OffsetA;
    2 - SlopeB;
    3 - OffsetB;
    */
};

typedef struct UE9_TDAC_CALIBRATION_INFORMATION ue9TdacCalibrationInfo;

/*   Functions   */

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
//Opens a UE9 connection over USB.  Returns NULL on failure, or a HANDLE
//on success.
//localID = the local ID or serial number of the UE9 you want to open

void closeUSBConnection( HANDLE hDevice);
//Closes a HANDLE to a UE9 device.

long getTickCount( void);
//Returns the number of milliseconds that has elasped since the system was
//started.

long getCalibrationInfo( HANDLE hDevice,
                         ue9CalibrationInfo *caliInfo);
//Gets calibration information from memory blocks 0-3 of a UE9.  Returns the
//calibration information in a calibrationInfo structure.
//hDevice = handle to a UE9 device
//caliInfo = structure where calibration information will be stored

long getTdacCalibrationInfo( HANDLE hDevice,
                             ue9TdacCalibrationInfo *caliInfo,
                             uint8 DIOAPinNum);
//Gets calibration information from the EEPROM of a LJTick-DAC (LJTDAC).
//Returns the calibration information in a ue9TdacCalibrationInfo structure.
//hDevice = handle to a UE9 device
//caliInfo = structure where LJTDAC calibration information will be stored
//DIOAPinNum = The UE9 digital IO line where the LJTDAC DIOA pin is connected.
//             The DIOB pin is assumed to be the next digital IO line.

double FPuint8ArrayToFPDouble( uint8 *buffer,
                               int startIndex);
//Converts a fixed point byte array (starting a startIndex) to a floating point
//double value.  This function is used primarily by getCalibrationInfo.

long isCalibrationInfoValid( ue9CalibrationInfo *caliInfo);
//Performs a simple check to determine if the caliInfo struct was set up by
//getCalibrationInfo.  Returns 0 if caliInfo is not valid, or 1 if it is.
//caliInfo = structure where calibrarion information is stored

long isTdacCalibrationInfoValid( ue9TdacCalibrationInfo *caliInfo);
//Performs a simple check to determine if the caliInfo struct was set up by
//getLJTDACCalibrationInfo.  Returns 0 if caliInfo is not valid, or 1 if it is.
//caliInfo = structure where LJTDAC calibration information is stored

long getAinVoltCalibrated( ue9CalibrationInfo *caliInfo,
                           uint8 gainBip,
                           uint8 resolution,
                           uint16 bytesVolt,
                           double *analogVolt);
//Translates the binary AIN reading from the UE9 to a voltage value
//(calibrated).  Call getCalibrationInfo first to set up caliInfo.  Returns -1
//on error, 0 on success.
//caliInfo = structure where calibrarion information is stored
//gainBip = the gain option and bipolar setting.  The high bit of the byte is
//          the bipolar setting and the lower 3 bits is the gain option.  See
//          the Feedback function in Section 5.3.3 of the UE9 User's Guide for a
//          table of BipGain values that can be passed.
//resolution = the resolution of the analog reading
//bytesVolt = the 2 byte voltage that will be converted to a analog value
//analogVolt = the converted analog voltage

long getDacBinVoltCalibrated( ue9CalibrationInfo *caliInfo,
                              int dacNumber,
                              double analogVolt,
                              uint16 *bytesVolt);
//Translates an analog output voltage to a binary 16 bit value (calibrated) that
//can be sent to a UE9.  Call getCalibrationInfo first to set up caliInfo.
//Returns -1 on error, 0 on success.
//caliInfo = structure where calibrarion information is stored
//dacNumber - channel number of the DAC
//analogVolt = the analog voltage that will be converted to a 2 byte value
//bytesVolt = the converted 2 byte voltage

long getTdacBinVoltCalibrated( ue9TdacCalibrationInfo *caliInfo,
                               int dacNumber,
                               double analogVolt,
                               uint16 *bytesVolt);
//Translates an analog output voltage to a binary 16 bit value (calibrated) that
//can be sent to a LJTick-DAC (LJTDAC).  Call getLJTDACCalibrationInfo first to
//set up caliInfo.  Returns -1 on error, 0 on success.
//caliInfo = structure where LJTDAC calibrarion information is stored
//DACNumber - channel number of the DAC (0 = DACA, 1 = DACB)
//analogVolt = the analog voltage that will be converted to a 2 byte value
//bytesVolt = the converted 2 byte voltage

long getTempKCalibrated( ue9CalibrationInfo *caliInfo,
                         int powerLevel,
                         uint16 bytesTemp,
                         double *kelvinTemp);
//Translates the binary reading from the UE9, to a Kelvin temperature value
//(calibrated).  Call getCalibrationInfo first to set up caliInfo.  Returns
//-1 on error, 0 on success.
//caliInfo = structure where calibrarion information is stored
//powerLevel = the power level the UE9 is set at.
//             (0x00: Fixed high, system clock = 48 MHz
//              0x01: Fixed low, system clock = 6 MHz)
//bytesTemp = the 2 byte temperature that will be converted to Kelvin
//kelvinTemp = the converted Kelvin temperature

long getAinVoltUncalibrated( uint8 gainBip,
                             uint8 resolution,
                             uint16 bytesVolt,
                             double *analogVolt);
//Translates the binary AIN reading from the UE9, to a voltage value
//(uncalibrated). Returns -1 on error, 0 on success.
//gainBip = the gain option and bipolar setting.  The high bit of the byte is
//          the bipolar setting and the lower 3 bits is the gain option.  See
//          the Feedback function in Section 5.3.3 of the UE9 User's Guide for a
//          table of BipGain values that can be passed.
//resolution = the resolution of the analog reading
//bytesVoltage = the 2 byte voltage that will be converted to a analog value
//analogVoltage = the converted analog voltage

long getDacBinVoltUncalibrated( int dacNumber,
                                double analogVolt,
                                uint16 *bytesVolt);
//Translates an analog output voltage to a binary 16 bit value (uncalibrated) 
//that can be sent to a UE9.  Returns -1 on error, 0 on success.
//dacNumber - channel number of the DAC
//analogVoltage = the analog voltage that will be converted to a 2 byte value
//bytesVoltage = the converted 2 byte voltage

long getTempKUncalibrated( int powerLevel,
                           uint16 bytesTemp,
                           double *kelvinTemp);
//Translates the binary reading from the UE9, to a Kelvin temperature
//value (uncalibrated).    Returns -1 on error, 0 on success.
//powerLevel = the power level the UE9 is set at.
//             (0x00: Fixed high, system clock = 48 MHz
//              0x01: Fixed low, system clock = 6 MHz)
//bytesTemp = the 2 byte temperature that will be converted to Kelvin
//kelvinTemp = the converted Kelvin temperature

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
//section 5.3.20 of the UE9 User's Guide for parameter documentation.  Returns
//-1 on error, 0 on success.
//hDevice = handle to a UE9 device
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


/* Easy Functions (Similar to the easy functions in the Windows UD driver) */

long eAIN( HANDLE Handle,
           ue9CalibrationInfo *CalibrationInfo,
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
//Handle = Handle to a UE9 device.
//CalibrationInfo = Structure where calibration information is stored.
//ChannelP = The positive AIN channel to acquire.
//ChannelN = For the UE9, this parameter is ignored.
//Voltage = Returns the analog input reading, which is generally a voltage.
//Range = Pass a constant specifying the voltage range.
//Resolution = Pass 12-17 to specify the resolution of the analog input reading,
//             and 18 for a high-res reading from UE9-Pro.  0-11 coresponds to
//             12-bit.
//Settling = Pass 0 for default settling.  This parameter adds extra settling
//           before the ADC conversion of about Settling times 5 microseconds.
//Binary = If this is nonzero (True), the Voltage parameter will return the raw
//         binary value.
//Reserved (1&2) = Pass 0.

long eDAC( HANDLE Handle,
           ue9CalibrationInfo *CalibrationInfo,
           long Channel,
           double Voltage,
           long Binary,
           long Reserved1,
           long Reserved2);
//An "easy" function that writes a value to one analog output.  Returns 0 for no
//error, or -1 or >0 value (low-level errorcode) on error.
//Handle = Handle to a UE9 device.
//CalibrationInfo = structure where calibrarion information is stored.
//Channel = The analog output channel to write to.
//Voltage = The voltage to write to the analog output.
//Binary = If this is nonzero (True), the value passed for Voltage should be
//         binary.
//Reserved (1&2) = Pass 0.

long eDI( HANDLE Handle,
          long Channel,
          long *State);
//An "easy" function that reads the state of one digital input.  This function
//does not automatically configure the specified channel as digital, unless
//ConfigIO is set as True.  Returns 0 for no error, or -1 or >0 value (low-level
//errorcode) on error.
//Handle = Handle to a UE9 device.
//Channel = The channel to read.  0-22 corresponds to FIO0-MIO2.
//State = Returns the state of the digital input.  0=False=Low and 1=True=High.

long eDO( HANDLE Handle,
          long Channel,
          long State);
//An "easy" function that writes the state of one digital output.  Returns 0 for
//no error, or -1 or >0 value (low-level errorcode) on error.
//Handle = Handle to a UE9 device.
//Channel = The channel to write to.  0-19 corresponds to FIO0-MIO2.
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
//counters.  Returns 0 for no error, or -1 or >0 value (low-level errorcode) on
//error.
//Handle = Handle to a UE9 device.
//aEnableTimers = An array where each element specifies whether that timer is
//                enabled.  Timers must be enabled in order starting from 0, so
//                for instance, Timer1 cannot be enabled without enabling
//                Timer 0 also.  A nonzero for an array element specifies to
//                enable that timer.  For the UE9 this array must always have at
//                least 6 elements.
//aEnableCounters = An array where each element specifies whether that counter
//                  is enabled.  Counters do not have to be enabled in order
//                  starting from 0, so Counter1 can be enabled when Counter0 is
//                  disabled.  A nonzero value for an array element specifies to
//                  enable that counter.  For the UE9, this array must always
//                  have at least 2 elements.
//TCPinOffset = Ignored with the UE9.
//TimerClockBaseIndex = Pass a constant to set the timer base clock.  The
//                      default is LJ_tc750KHZ.
//TimerClockDivisor = Pass a divisor from 0-255 where 0 is a divisor of 256.
//aTimerModes = An array where each element is a constant specifying the mode
//              for that timer.  For the UE9, this array must always have at
//              least 6 elements.
//aTimerValues = An array where each element specifies the initial value for
//               that timer.  For the UE9, this array must always have at least
//               6 elements.
//Reserved (1&2) = Pass 0.

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
//Handle = Handle to a UE9 device.
//aReadTimers = An array where each element specifies whether to read that
//              timer. A nonzero value for an array element specifies to read
//              that timer.  For the UE9, this array must always have at least 6
//              elements.
//aUpdateResetTimers = An array where each element specifies whether to
//                     update/reset that timers.  A nonzero value for an array
//                     element specifies to update/reset that timer.  For the
//                     UE9, this array must always have at least 6 elements.
//aReadCounters = An array where each element specifies whether to read that
//                counter.  A nonzero value for an array element specifies to
//                read that counter.  For the UE9, this array must always have
//                at least 2 elements.
//aResetCounters = An array where each element specifies whether to reset that
//                 counter.  A nonzero value for an array element specifies to
//                 reset that counter.  For the UE9, this array must always have
//                 at least 2 elements.
//aTimerValues = Input: An array where each element is the new value for that
//               timer.  Each value is only updated if the appropriate element
//               is set in the aUpdateResetTimers array.
//               Output: An array where each element is the value read from that
//               timer if the appropriate element is set in the aReadTimers
//               array.  If the timer mode set for the timer is Quadrature
//               Input, the value needs to be converted from an unsigned 32-bit
//               integer to a signed 32-bit integer (2’s complement).  For the
//               UE9, this array must always have at least 6 elements.
//aCounterValues = An array where each element is the value read from that
//                 counter if the appropriate element is set in the aReadTimers
//                 array.  For the UE9, this array must always have at least 2
//                 elements.
//Reserved (1&2) = Pass 0.


/* Easy Function Helpers */

long ehSingleIO( HANDLE hDevice,
                 uint8 inIOType,
                 uint8 inChannel,
                 uint8 inDirBipGainDACL,
                 uint8 inStateResDACH,
                 uint8 inSettlingTime,
                 uint8 *outIOType,
                 uint8 *outChannel,
                 uint8 *outDirAINL,
                 uint8 *outStateAINM,
                 uint8 *outAINH);
//Used by the eAIN and eDAC easy functions.  This function takes the SingleIO
//low-level command and response bytes (not including checksum and command
//bytes) as its parameter and performs a SingleIO call with the UE9.  Returns -1
//on error, 0 on success.


long ehDIO_Feedback( HANDLE hDevice,
                     uint8 channel,
                     uint8 direction,
                     uint8 *state);
//Used by the eDI and eDO easy funtions.  This function takes the same
//parameters as eDI and eDO (as bytes), with the additional parameter of
//channel, and will perform the Feedback low-level function call.  Returns -1 on
//error, 0 on success.


long ehTimerCounter( HANDLE hDevice,
                     uint8 inTimerClockDivisor,
                     uint8 inEnableMask,
                     uint8 inTimerClockBase,
                     uint8 inUpdateReset,
                     uint8 *inTimerMode,
                     uint16 *inTimerValue,
                     uint8 *inCounterMode,
                     uint32 *outTimer,
                     uint32 *outCounter);
//Used by the eTCConfig and eTCValues easy functions.  This function takes the
//TimerCounter low-level command and response bytes (not including checksum and
//command bytes) as its parameter and performs a TimerCounter call with the UE9.
//Returns -1 or errorcode (>1 value) on error, 0 on success.


/* Easy Functions Constants */

/* Ranges */

// -5V to +5V
#define LJ_rgBIP5V 3

// 0V to +5V
#define LJ_rgUNI5V 103

// 0V to +2.5V
#define LJ_rgUNI2P5V 105

// 0V to +1.25Vz
#define LJ_rgUNI1P25V 107

// 0V to +0.625V
#define LJ_rgUNIP625V 109


/* timer clocks: */

// 750 khz
#define LJ_tc750KHZ 0

// system clock
#define LJ_tcSYS 1


/* timer modes */

// 16 bit PWM
#define LJ_tmPWM16 0

// 8 bit PWM
#define LJ_tmPWM8 1

// 32-bit rising to rising edge measurement
#define LJ_tmRISINGEDGES32 2

// 32-bit falling to falling edge measurement
#define LJ_tmFALLINGEDGES32 3

// duty cycle measurement
#define LJ_tmDUTYCYCLE 4

// firmware based rising edge counter
#define LJ_tmFIRMCOUNTER 5

// firmware counter with debounce
#define LJ_tmFIRMCOUNTERDEBOUNCE 6

// frequency output
#define LJ_tmFREQOUT 7

// Quadrature
#define LJ_tmQUAD 8

// stops another timer after n pulses
#define LJ_tmTIMERSTOP 9

// read lower 32-bits of system timer
#define LJ_tmSYSTIMERLOW 10

// read upper 32-bits of system timer
#define LJ_tmSYSTIMERHIGH 11

// 16-bit rising to rising edge measurement
#define LJ_tmRISINGEDGES16 12

// 16-bit falling to falling edge measurement
#define LJ_tmFALLINGEDGES16 13

#ifdef __cplusplus
}
#endif

#endif
