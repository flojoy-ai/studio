//Author: LabJack
//May 25, 2011
//Example UE9 helper functions.  Function descriptions are in ue9.h.

#include "ue9.h"


ue9CalibrationInfo UE9_CALIBRATION_INFO_DEFAULT = {
    9,
    //Nominal Values
    {   0.000077503,
        -0.012,
        0.000038736,
        -0.012,
        0.000019353,
        -0.012,
        0.0000096764,
        -0.012,
        0.00015629,
        -5.176,
        842.59,
        0.0,
        842.259,
        0.0,
        0.012968,
        0.012968,
        298.15,
        2.43,
        0.0,
        1.215,
        0.00009272,
        0.000077503,
        -0.012,
        0.00015629,
        -5.176}
};


void normalChecksum(uint8 *b, int n)
{
    b[0] = normalChecksum8(b,n);
}


void extendedChecksum(uint8 *b, int n)
{
    uint16 a;

    a = extendedChecksum16(b,n);
    b[4] = (uint8)(a & 0xFF);
    b[5] = (uint8)((a/256) & 0xFF);
    b[0] = extendedChecksum8(b);
}


uint8 normalChecksum8(uint8 *b, int n)
{
    int i;
    uint16 a, bb;

    //Sums bytes 1 to n-1 unsigned to a 2 byte value. Sums quotient and
    //remainder of 256 division.  Again, sums quotient and remainder of
    //256 division.
    for( i = 1, a = 0; i < n; i++ )
        a += (uint16)b[i];

    bb = a/256;
    a = (a - 256*bb) + bb;
    bb = a/256;

    return (uint8)((a - 256*bb) + bb);
}


uint16 extendedChecksum16(uint8 *b, int n)
{
    int i, a = 0;

    //Sums bytes 6 to n-1 to a unsigned 2 byte value
    for( i = 6; i < n; i++ )
        a += (uint16)b[i];

    return a;
}


uint8 extendedChecksum8(uint8 *b)
{
    int i, a, bb;

    //Sums bytes 1 to 5. Sums quotient and remainder of 256 division. Again, sums 
    //quotient and remainder of 256 division.
    for( i = 1, a = 0; i < 6; i++ )
        a += (uint16)b[i];

    bb = a/256;
    a = (a - 256*bb) + bb;
    bb = a/256;

    return (uint8)((a - 256*bb) + bb);
}


HANDLE openUSBConnection(int localID)
{
    BYTE buffer[38];
    uint16 checksumTotal = 0;
    uint32 numDevices = 0;
    uint32 dev;
    int i, serial;
    HANDLE hDevice = 0;

    numDevices = LJUSB_GetDevCount(UE9_PRODUCT_ID);
    if( numDevices == 0 ) 
    {
        printf("Open error: No UE9 devices could be found\n");
        return NULL;
    }

    for( dev = 1;  dev <= numDevices; dev++ )
    {
        hDevice = LJUSB_OpenDevice(dev, 0, UE9_PRODUCT_ID);
        if( hDevice != NULL )
        {
            if( localID < 0 )
            {
                return hDevice;
            }
            else
            {
                checksumTotal = 0;

                //Setting up a CommConfig command
                buffer[1] = (BYTE)(0x78);
                buffer[2] = (BYTE)(0x10);
                buffer[3] = (BYTE)(0x01);

                for( i = 6; i < 38; i++ )
                    buffer[i] = (BYTE)(0x00);

                extendedChecksum(buffer,38);

                if( LJUSB_Write(hDevice, buffer, 38) != 38 )
                    goto locid_error;

                for( i = 0; i < 38; i++ )
                    buffer[i] = 0;

                if( LJUSB_Read(hDevice, buffer, 38) != 38 )
                    goto locid_error;

                checksumTotal = extendedChecksum16(buffer, 38);
                if( (BYTE)((checksumTotal / 256) & 0xFF) != buffer[5] )
                    goto locid_error;

                if( (BYTE)(checksumTotal & 0xFF) != buffer[4] )
                    goto locid_error;

                if( extendedChecksum8(buffer) != buffer[0] )
                    goto locid_error;

                if( buffer[1] != (BYTE)(0x78) || buffer[2] != (BYTE)(0x10) || buffer[3] != (BYTE)(0x01) )
                    goto locid_error;

                //Check local ID
                if( (int)buffer[8] == localID )
                    return hDevice;
                
                //Check serial number
                serial = buffer[28] + buffer[29]*256 + buffer[30]*65536 + 0x10000000;
                if( serial == localID )
                    return hDevice;

                //No matches.  Not our device.
                LJUSB_CloseDevice(hDevice);

            }  //else localID >= 0 end
        }  //if hDevice != NULL end
    }  //for end

    printf("Open error: could not find a UE9 with a local ID or serial number of %d\n", localID);
    return NULL;

locid_error:
    printf("Open error: problem when checking local ID and serial number\n");
    return NULL;
}


void closeUSBConnection(HANDLE hDevice) 
{
    LJUSB_CloseDevice(hDevice);
}


long getTickCount()
{
    struct timeval tv;

    gettimeofday(&tv, NULL);

    return (tv.tv_sec * 1000) + (tv.tv_usec / 1000);
}


long getCalibrationInfo(HANDLE hDevice, ue9CalibrationInfo *caliInfo)
{
    BYTE sendBuffer[8], recBuffer[136];
    int sentRec = 0, i = 0, j = 0, ccTotal = 0, count = 0;

    /* Setting up command */
    sendBuffer[1] = (BYTE)(0xF8);  //command byte
    sendBuffer[2] = (BYTE)(0x01);  //number of data words
    sendBuffer[3] = (BYTE)(0x2A);  //extended command number
    sendBuffer[6] = (BYTE)(0x00);

    for( i = 0; i < 5; i++ )
    {
        /* Reading block 1 from memory */
        sendBuffer[7] = (BYTE)i;    //Blocknum = i
        extendedChecksum(sendBuffer, 8);

        sentRec = LJUSB_Write(hDevice, sendBuffer, 8);
        if( sentRec < 8 )
        {
            if( sentRec == 0 )
                printf("getCalibrationInfo error : write failed\n");
            else
                printf("getCalibrationInfo error : did not write all of the buffer\n");
            return -1;
        }

        sentRec = LJUSB_Read(hDevice, recBuffer, 136);
        if( sentRec < 136 )
        {
            if( sentRec == 0 )
                printf("getCalibrationInfo Error : read failed\n");
            else
                printf("getCalibrationInfo Error : did not read all of the buffer\n");
        }

        if( recBuffer[1] != (BYTE)(0xF8) || recBuffer[2] != (BYTE)(0x41) || recBuffer[3] != (BYTE)(0x2A) )
        {
            printf("getCalibrationInfo error: incorrect command bytes for ReadMem response");
            return -1;
        }

        //Reading out calbration constants
        if( i == 0 )
            ccTotal = 8;
        if( i == 1 )
            ccTotal = 2;
        if( i == 2 )
            ccTotal = 13;
        if( i == 3 )
            ccTotal = 2;
        if( i == 4 )
            ccTotal = 2;

        for( j = 0; j < ccTotal; j++ )
        {
            if( i != 2 || (i == 2 && j != 5 && j != 7) )
            {
                //Block data starts on byte 8 of the buffer
                caliInfo->ccConstants[count] = FPuint8ArrayToFPDouble(recBuffer + 8, j*8);
                count++;
            }
        }
    }

    caliInfo->prodID = 9;

    return 0;
}

long getTdacCalibrationInfo(HANDLE hDevice, ue9TdacCalibrationInfo *caliInfo, uint8 DIOAPinNum)
{
    int err;
    uint8 options, speedAdjust, sdaPinNum, sclPinNum;
    uint8 address, numByteToSend, numBytesToReceive, errorcode;
    uint8 bytesCommand[1];
    uint8 bytesResponse[32];
    uint8 ackArray[4];

    err = 0;

    //Setting up I2C command for LJTDAC
    options = 0;  //I2COptions : 0
    speedAdjust = 0;  //SpeedAdjust : 0 (for max communication speed of about 130 kHz)
    sdaPinNum = DIOAPinNum+1;  //SDAPinNum : FIO channel connected to pin DIOB
    sclPinNum = DIOAPinNum;  //SCLPinNum : FIO channel connected to pin DIOA
    address = (uint8)(0xA0);  //Address : h0xA0 is the address for EEPROM
    numByteToSend = 1;  //NumI2CByteToSend : 1 byte for the EEPROM address
    numBytesToReceive = 32;  //NumI2CBytesToReceive : getting 32 bytes starting at EEPROM address specified in I2CByte0

    bytesCommand[0] = 64;  //I2CByte0 : Memory Address (starting at address 64 (DACA Slope)

    //Performing I2C low-level call
    err = I2C(hDevice, options, speedAdjust, sdaPinNum, sclPinNum, address, numByteToSend, numBytesToReceive, bytesCommand, &errorcode, ackArray, bytesResponse);

    if( errorcode != 0 )
    {
        printf("Getting LJTDAC calibration info error : received errorcode %d in response\n", errorcode);
        err = -1;
    }

    if( err == -1 )
        return err;

    caliInfo->ccConstants[0] = FPuint8ArrayToFPDouble(bytesResponse, 0);
    caliInfo->ccConstants[1] = FPuint8ArrayToFPDouble(bytesResponse, 8);
    caliInfo->ccConstants[2] = FPuint8ArrayToFPDouble(bytesResponse, 16);
    caliInfo->ccConstants[3] = FPuint8ArrayToFPDouble(bytesResponse, 24);
    caliInfo->prodID = 9;

    return err;
}


double FPuint8ArrayToFPDouble(uint8 *buffer, int startIndex) 
{ 
    uint32 resultDec = 0, resultWh = 0;

    resultDec = (uint32)buffer[startIndex] |
                ((uint32)buffer[startIndex + 1] << 8) |
                ((uint32)buffer[startIndex + 2] << 16) |
                ((uint32)buffer[startIndex + 3] << 24);

    resultWh = (uint32)buffer[startIndex + 4] |
                ((uint32)buffer[startIndex + 5] << 8) |
                ((uint32)buffer[startIndex + 6] << 16) |
                ((uint32)buffer[startIndex + 7] << 24);

    return ( (double)((int)resultWh) + (double)(resultDec)/4294967296.0 );
}


long isCalibrationInfoValid(ue9CalibrationInfo *caliInfo)
{
    if( caliInfo == NULL )
        goto invalid;
    if( caliInfo->prodID != 9 )
        goto invalid;
    return 1;
invalid:
    printf("Error: Invalid calibration info.\n");
    return 0;
}


long isTdacCalibrationInfoValid(ue9TdacCalibrationInfo *caliInfo)
{
    if( caliInfo == NULL )
        goto invalid;
    if( caliInfo->prodID != 9 )
        goto invalid;
    return 1;
invalid:
    printf("Error: Invalid LJTDAC calibration info.\n");
    return 0;
}


long getAinVoltCalibrated(ue9CalibrationInfo *caliInfo, uint8 gainBip, uint8 resolution, uint16 bytesVolt, double *analogVolt)
{
    if( isCalibrationInfoValid(caliInfo) == 0 )
        return -1;

    if( resolution < 18 )
    {
        if( gainBip <= 3 || gainBip == 8 )
        {
            if( gainBip == 8 )
                gainBip = 4;  //setting this for index purposes
            *analogVolt = (caliInfo->ccConstants[gainBip*2]*bytesVolt) + caliInfo->ccConstants[gainBip*2 + 1];
            return 0;
        }
        else
            goto invalidGainBip;
    }
    else  //UE9 Pro high res
    {
        if( gainBip == 0 || gainBip == 8 )
        {
            if( gainBip == 8 )
                gainBip = 1;  //setting this for index purposes
            *analogVolt = (caliInfo->ccConstants[gainBip*2 + 21]*bytesVolt) + caliInfo->ccConstants[gainBip*2 + 22];
            return 0;
        }
        else
            goto invalidGainBip;
    }

invalidGainBip:
    printf("getAinVoltCalibrated error: invalid GainBip.\n");
    return -1;
}


long getDacBinVoltCalibrated(ue9CalibrationInfo *caliInfo, int dacNumber, double analogVolt, uint16 *bytesVolt)
{
    double tBytesVolt;

    if( isCalibrationInfoValid(caliInfo) == 0 )
        return -1;

    if( dacNumber < 0 || dacNumber > 2 )
    {
        printf("getDacBinVoltCalibrated error: invalid channelNumber.\n");
        return -1;
    }

    tBytesVolt = analogVolt*caliInfo->ccConstants[10 + dacNumber*2] +   caliInfo->ccConstants[11 + dacNumber*2];

    //Checking to make sure bytesVoltage will be a value between 0 and 4095, or 
    //that a uint16 overflow does not occur.  A too high analogVoltage (above 5 
    //volts) or too low analogVoltage (below 0 volts) will cause a value not 
    //between 0 and 4095.
    if( tBytesVolt < 0 )
        tBytesVolt = 0;
    if( tBytesVolt > 4095 )
        tBytesVolt = 4095;

    *bytesVolt = (uint16)tBytesVolt; 

    return 0;
}


long getTdacBinVoltCalibrated(ue9TdacCalibrationInfo *caliInfo, int dacNumber, double analogVolt, uint16 *bytesVolt)
{
    uint32 tBytesVolt;

    if( isTdacCalibrationInfoValid(caliInfo) == 0 )
        return -1;

    if( dacNumber < 0 || dacNumber > 2 )
    {
        printf("getTdacBinVoltCalibrated error: invalid channelNumber.\n");
        return -1;
    }

    tBytesVolt = analogVolt*caliInfo->ccConstants[dacNumber*2] + caliInfo->ccConstants[dacNumber*2 + 1];

    //Checking to make sure bytesVolt will be a value between 0 and 65535.
    if( tBytesVolt > 65535 )
        tBytesVolt = 65535;

    *bytesVolt = (uint16)tBytesVolt;

    return 0;  
}


long getTempKCalibrated(ue9CalibrationInfo *caliInfo, int powerLevel, uint16 bytesTemp, double *kelvinTemp)
{
    if( isCalibrationInfoValid(caliInfo) == 0 )
        return -1;

    if( powerLevel == 0 || powerLevel == 1 )
    {
        *kelvinTemp = caliInfo->ccConstants[14 + powerLevel]*bytesTemp;
        return 0;
    }
    else
    {
        printf("getTempKCalibrated error: invalid powerLevel.\n");
        return -1;
    }
}


long getAinVoltUncalibrated(uint8 gainBip, uint8 resolution, uint16 bytesVolt, double *analogVolt)
{
    return getAinVoltCalibrated(&UE9_CALIBRATION_INFO_DEFAULT, gainBip, resolution, bytesVolt, analogVolt);
}

long getDacBinVoltUncalibrated(int dacNumber, double analogVolt, uint16 *bytesVolt)
{
    return getDacBinVoltCalibrated(&UE9_CALIBRATION_INFO_DEFAULT, dacNumber, analogVolt, bytesVolt);
}

long getTempKUncalibrated(int powerLevel, uint16 bytesTemp, double *kelvinTemp)
{
    return getTempKCalibrated(&UE9_CALIBRATION_INFO_DEFAULT, powerLevel, bytesTemp, kelvinTemp);
}


long I2C(HANDLE hDevice, uint8 I2COptions, uint8 SpeedAdjust, uint8 SDAPinNum, uint8 SCLPinNum, uint8 Address, uint8 NumI2CBytesToSend, uint8 NumI2CBytesToReceive, uint8 *I2CBytesCommand, uint8 *Errorcode, uint8 *AckArray, uint8 *I2CBytesResponse)
{
    uint8 *sendBuff, *recBuff;
    uint16 checksumTotal = 0;
    uint32 ackArrayTotal, expectedAckArray;
    int sendChars, recChars, sendSize, recSize, i, ret;

    *Errorcode = 0;
    ret = 0;
    sendSize = 6 + 8 + ((NumI2CBytesToSend%2 != 0)?(NumI2CBytesToSend + 1):(NumI2CBytesToSend));
    recSize = 6 + 6 + ((NumI2CBytesToReceive%2 != 0)?(NumI2CBytesToReceive + 1):(NumI2CBytesToReceive));

    sendBuff = (uint8 *)malloc(sizeof(uint8)*sendSize);
    recBuff = (uint8 *)malloc(sizeof(uint8)*recSize);

    sendBuff[sendSize - 1] = 0;

    //I2C command
    sendBuff[1] = (uint8)(0xF8);     //Command byte
    sendBuff[2] = (sendSize - 6)/2;  //Number of data words = 4 + NumI2CBytesToSend
    sendBuff[3] = (uint8)(0x3B);     //Extended command number

    sendBuff[6] = I2COptions;   //I2COptions
    sendBuff[7] = SpeedAdjust;  //SpeedAdjust
    sendBuff[8] = SDAPinNum;    //SDAPinNum
    sendBuff[9] = SCLPinNum;    //SCLPinNum
    sendBuff[10] = Address;     //Address
    sendBuff[11] = 0;           //Reserved
    sendBuff[12] = NumI2CBytesToSend;     //NumI2CByteToSend
    sendBuff[13] = NumI2CBytesToReceive;  //NumI2CBytesToReceive

    for( i = 0; i < NumI2CBytesToSend; i++ )
        sendBuff[14 + i] = I2CBytesCommand[i];  //I2CByte

    extendedChecksum(sendBuff, sendSize);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, sendSize);
    if( sendChars < sendSize )
    {
        if( sendChars == 0 )
            printf("I2C Error : write failed\n");
        else
            printf("I2C Error : did not write all of the buffer\n");
        ret = -1;
        goto cleanmem;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, recSize);
    if( recChars < recSize )
    {
        if( recChars == 0 )
            printf("I2C Error : read failed\n");
        else
        {
            printf("I2C Error : did not read all of the buffer\n");
            if( recChars >= 12 )
                *Errorcode = recBuff[6];
        }
        ret = -1;
        goto cleanmem;
    }

    *Errorcode = recBuff[6];

    AckArray[0] = recBuff[8];
    AckArray[1] = recBuff[9];
    AckArray[2] = recBuff[10];
    AckArray[3] = recBuff[11];

    for( i = 0; i < NumI2CBytesToReceive; i++ )
        I2CBytesResponse[i] = recBuff[12 + i];

    if( (uint8)(extendedChecksum8(recBuff)) != recBuff[0] )
    {
        printf("I2C Error : read buffer has bad checksum (%d)\n", recBuff[0]);
        ret = -1;
    }

    if( recBuff[1] != (uint8)(0xF8) )
    {
        printf("I2C Error : read buffer has incorrect command byte (%d)\n", recBuff[1]);
        ret = -1;
    }

    if( recBuff[2] != (uint8)((recSize - 6)/2) )
    {
        printf("I2C Error : read buffer has incorrect number of data words (%d)\n", recBuff[2]);
        ret = -1;
    }

    if( recBuff[3] != (uint8)(0x3B) )
    {
        printf("I2C Error : read buffer has incorrect extended command number (%d)\n", recBuff[3]);
        ret = -1;
    }

    checksumTotal = extendedChecksum16(recBuff, recSize);
    if( (uint8)((checksumTotal / 256) & 0xFF) != recBuff[5] || (uint8)(checksumTotal & 0xFF) != recBuff[4] )
    {
        printf("I2C error : read buffer has bad checksum16 (%u)\n", checksumTotal);
        ret = -1;
    }

    //ackArray should ack the Address byte in the first ack bit, but did not until control firmware 1.84
    ackArrayTotal = AckArray[0] + AckArray[1]*256 + AckArray[2]*65536 + AckArray[3]*16777216;
    expectedAckArray = pow(2.0,  NumI2CBytesToSend+1) - 1;
    if( ackArrayTotal != expectedAckArray )
        printf("I2C error : expected an ack of %u, but received %u\n", expectedAckArray, ackArrayTotal);

cleanmem:
    free(sendBuff);
    free(recBuff);
    sendBuff = NULL;
    recBuff = NULL;

    return ret;
}


long eAIN(HANDLE Handle, ue9CalibrationInfo *CalibrationInfo, long ChannelP, long ChannelN, double *Voltage, long Range, long Resolution, long Settling, long Binary, long Reserved1, long Reserved2)
{
    uint8 IOType, Channel, AINM, AINH, ainGain;
    uint16 bytesVT;

    if( isCalibrationInfoValid(CalibrationInfo) == 0 )
    {
        printf("eAIN error: calibration information is required");
        return -1;
    }

    if( Range == LJ_rgBIP5V )
        ainGain = 8;
    else if( Range == LJ_rgUNI5V )
        ainGain = 0;
    else if( Range == LJ_rgUNI2P5V )
        ainGain = 1;
    else if( Range == LJ_rgUNI1P25V )
        ainGain = 2;
    else if( Range == LJ_rgUNIP625V )
        ainGain = 3;
    else
    {
        printf("eAIN error: Invalid Range\n");
        return -1;
    }

    if( ehSingleIO(Handle, 4, (uint8)ChannelP, ainGain, (uint8)Resolution, (uint8)Settling, &IOType, &Channel, NULL, &AINM, &AINH) < 0 )
        return -1;

    bytesVT = AINM + AINH*256;

    if( Binary != 0 )
    {
        *Voltage = (double)bytesVT;
    }
    else
    {
        if( ChannelP == 133 || ChannelP == 141 )
        {
            if( getTempKCalibrated(CalibrationInfo, 0, bytesVT, Voltage) < 0 )
                return -1;
        }
        else
        {
            if( getAinVoltCalibrated(CalibrationInfo, ainGain, (uint8)Resolution, bytesVT, Voltage) < 0 )
                return -1;
        }
    }

    return 0;
}


long eDAC(HANDLE Handle, ue9CalibrationInfo *CalibrationInfo, long Channel, double Voltage, long Binary, long Reserved1, long Reserved2)
{
    uint8 IOType, channel;
    uint16 bytesVoltage;

    if( isCalibrationInfoValid(CalibrationInfo) == 0 )
    {
        printf("eDAC error: calibration information is required");
        return -1;
    }

    if( getDacBinVoltCalibrated(CalibrationInfo, (uint8)Channel, Voltage, &bytesVoltage) < 0 )
        return -1;

    return ehSingleIO(Handle, 5, (uint8)Channel, (uint8)( bytesVoltage & (0x00FF) ), (uint8)(( bytesVoltage /256 ) + 192), 0, &IOType, &channel, NULL, NULL, NULL);
}


long eDI(HANDLE Handle, long Channel, long *State)
{
    uint8 state;

    if( Channel > 22 )
    {
        printf("eDI error: Invalid Channel");
        return -1;
    }

    if( ehDIO_Feedback(Handle, (uint8)Channel, 0, &state) < 0 )
        return -1;

    *State = state;

    return 0;
}


long eDO(HANDLE Handle, long Channel, long State)
{
    uint8 state;

    state = (uint8)State;
    if( Channel > 22 )
    {
        printf("eDO error: Invalid Channel");
        return -1;
    }

    return ehDIO_Feedback(Handle, (uint8)Channel, 1, &state);
}


long eTCConfig(HANDLE Handle, long *aEnableTimers, long *aEnableCounters, long TCPinOffset, long TimerClockBaseIndex, long TimerClockDivisor, long *aTimerModes, double *aTimerValues, long Reserved1, long Reserved2)
{
    uint8 enableMask, timerMode[6], counterMode[2];
    uint16 timerValue[6];
    int numTimers, numTimersStop, i;

    //Setting EnableMask
    enableMask = 128;  //Bit 7: UpdateConfig

    if(aEnableCounters[1] != 0)
        enableMask += 16;  //Bit 4: Enable Counter1

    if(aEnableCounters[0] != 0)
        enableMask += 8;  //Bit 3: Enable Counter0

    numTimers = 0;
    numTimersStop = 0;

    for( i = 0; i < 6; i++ )
    {
        if( aEnableTimers[i] != 0 && numTimersStop == 0 )
        {
            numTimers++;
            timerMode[i] = (uint8)aTimerModes[i];     //TimerMode
            timerValue[i] = (uint16)aTimerValues[i];  //TimerValue
        }
        else
        {
            numTimersStop = 1;
            timerMode[i] = 0;
            timerValue[i] = 0;
        }
    }
    enableMask += numTimers;  //Bits 2-0: Number of Timers

    counterMode[0] = 0;  //Counter0Mode
    counterMode[1] = 0;  //Counter1Mode

    return ehTimerCounter(Handle, (uint8)TimerClockDivisor, enableMask, (uint8)TimerClockBaseIndex, 0, timerMode, timerValue, counterMode, NULL, NULL);
}


long eTCValues(HANDLE Handle, long *aReadTimers, long *aUpdateResetTimers, long *aReadCounters, long *aResetCounters, double *aTimerValues, double *aCounterValues, long Reserved1, long Reserved2)
{
    uint8 updateReset, timerMode[6], counterMode[2];
    uint16 timerValue[6];
    uint32 timer[6], counter[2];
    int i;
    long errorcode;

    //UpdateReset
    updateReset = 0;
    for( i = 0; i < 6; i++ )
    {
        updateReset += ((aUpdateResetTimers[i] != 0) ? pow(2, i) : 0);
        timerMode[i] = 0;
        timerValue[i] = 0;
    }

    for( i = 0; i < 2; i++ )
    {
        updateReset += ((aResetCounters[i] != 0) ? pow(2, 6 + i) : 0);
        counterMode[i] = 0;
    }

    if( (errorcode = ehTimerCounter(Handle, 0, 0, 0, updateReset, timerMode, timerValue, counterMode, timer, counter)) != 0 )
        return errorcode;

    for( i = 0; i < 6; i++ )
        aTimerValues[i] = timer[i];

    for( i = 0; i < 2; i++ )
        aCounterValues[i] = counter[i];

    return 0;
}


long ehSingleIO(HANDLE hDevice, uint8 inIOType, uint8 inChannel, uint8 inDirBipGainDACL, uint8 inStateResDACH, uint8 inSettlingTime, uint8 *outIOType, uint8 *outChannel, uint8 *outDirAINL, uint8 *outStateAINM, uint8 *outAINH)
{
    BYTE sendBuff[8], recBuff[8];
    int sendChars, recChars;

    sendBuff[1] = (BYTE)(0xA3);      //Command byte
    sendBuff[2] = inIOType;          //IOType
    sendBuff[3] = inChannel;         //Channel
    sendBuff[4] = inDirBipGainDACL;  //Dir/BipGain/DACL
    sendBuff[5] = inStateResDACH;    //State/Resolution/DACH
    sendBuff[6] = inSettlingTime;    //Settling time
    sendBuff[7] = 0;                 //Reserved
    sendBuff[0] = normalChecksum8(sendBuff, 8);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 8);
    if( sendChars < 8 )
    {
        if( sendChars == 0 )
            printf("SingleIO error : write failed\n");
        else
            printf("SingleIO error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 8);
    if( recChars < 8 )
    {
        if( recChars == 0 )
            printf("SingleIO error : read failed\n");
        else
            printf("SingleIO error : did not read all of the buffer\n");
        return -1;
    }

    if( (BYTE)(normalChecksum8(recBuff, 8)) != recBuff[0] )
    {
        printf("SingleIO error : read buffer has bad checksum\n");
        return -1;
    }

    if( recBuff[1] != (BYTE)(0xA3) )
    {
        printf("SingleIO error : read buffer has wrong command byte\n");
        return -1;
    }

    if( outIOType != NULL )
        *outIOType = recBuff[2];
    if( outChannel != NULL )
        *outChannel = recBuff[3];
    if( outDirAINL != NULL )
        *outDirAINL = recBuff[4];
    if( outStateAINM != NULL )
        *outStateAINM = recBuff[5];
    if( outAINH != NULL )
        *outAINH = recBuff[6];

    return 0;
}


long ehDIO_Feedback(HANDLE hDevice, uint8 channel, uint8 direction, uint8 *state)
{
    BYTE sendBuff[34], recBuff[64];
    BYTE tempDir, tempState, tempByte;
    uint16 checksumTotal;
    int sendChars, recChars, i;

    sendBuff[1] = (BYTE)(0xF8);  //Command byte
    sendBuff[2] = (BYTE)(0x0E);  //Number of data words
    sendBuff[3] = (BYTE)(0x00);  //Extended command number

    for( i = 6; i < 34; i++ )
        sendBuff[i] = 0;

    tempDir = ((direction < 1) ? 0 : 1);
    tempState = ((*state < 1) ? 0 : 1);

    if( channel <=  7 )
    {
        tempByte = pow(2, channel);
        sendBuff[6] = tempByte;
        if( tempDir )
            sendBuff[7] = tempByte;
        if( tempState )
            sendBuff[8] = tempByte;
    }
    else if( channel <= 15 )
    {
        tempByte = pow(2, (channel - 8));
        sendBuff[9] = tempByte;
        if( tempDir )
            sendBuff[10] = tempByte;
        if( tempState )
            sendBuff[11] = tempByte;
    }
    else if( channel <= 19 )
    {
        tempByte = pow(2, (channel - 16));
        sendBuff[12] = tempByte;
        if( tempDir )
            sendBuff[13] = tempByte*16;
        if( tempState )
            sendBuff[13] += tempByte;
    }
    else if( channel <= 22 )
    {
        tempByte = pow(2, (channel - 20));
        sendBuff[14] = tempByte;
        if( tempDir )
            sendBuff[15] = tempByte*16;
        if( tempState )
            sendBuff[15] += tempByte;
    }
    else
    {
        printf("DIO Feedback error: Invalid Channel\n");
        return -1;
    }

    extendedChecksum(sendBuff, 34);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 34);
    if( sendChars < 34 )
    {
        if( sendChars == 0 )
            printf("DIO Feedback error : write failed\n");
        else
            printf("DIO Feedback error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 64);
    if( recChars < 64 )
    {
        if( recChars == 0 )
            printf("DIO Feedback error : read failed\n");
        else
            printf("DIO Feedback error : did not read all of the buffer\n");
        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 64);
    if( (BYTE)((checksumTotal / 256) & 0xFF) != recBuff[5] )
    {
        printf("DIO Feedback error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (BYTE)(checksumTotal & 0xFF) != recBuff[4] )
    {
        printf("DIO Feedback error : read buffer has bad checksum16(LSB)\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("DIO Feedback error : read buffer has bad checksum8\n");
        return -1;
    }

    if( recBuff[1] != (BYTE)(0xF8) || recBuff[2] != (BYTE)(0x1D) || recBuff[3] != (BYTE)(0x00) )
    {
        printf("DIO Feedback error : read buffer has wrong command bytes\n");
        return -1;
    }

    if( channel <=  7 )
        *state = ((recBuff[7] & tempByte) ? 1 : 0);
    else if( channel <= 15 )
        *state = ((recBuff[9] & tempByte) ? 1 : 0);
    else if( channel <= 19 )
        *state = ((recBuff[10] & tempByte) ? 1 : 0);
    else if( channel <= 22 )
        *state = ((recBuff[11] & tempByte) ? 1 : 0);

    return 0;
}


long ehTimerCounter(HANDLE hDevice, uint8 inTimerClockDivisor, uint8 inEnableMask, uint8 inTimerClockBase, uint8 inUpdateReset, uint8 *inTimerMode, uint16 *inTimerValue, uint8 *inCounterMode, uint32 *outTimer, uint32 *outCounter)
{
    BYTE sendBuff[30], recBuff[40];
    uint16 checksumTotal;
    int sendChars, recChars, i, j;

    sendBuff[1] = (BYTE)(0xF8);  //Command byte
    sendBuff[2] = (BYTE)(0x0C);  //Number of data words
    sendBuff[3] = (BYTE)(0x18);  //Extended command number

    sendBuff[6] = inTimerClockDivisor;  //TimerClockDivisor
    sendBuff[7] = inEnableMask;  //EnableMask
    sendBuff[8] = inTimerClockBase;  //TimerClockBase

    sendBuff[9] = inUpdateReset;  //UpdateReset

    for( i = 0; i < 6; i++ )
    {
        sendBuff[10 + i*3] = inTimerMode[i];  //TimerMode
        sendBuff[11 + i*3] = (BYTE)(inTimerValue[i] & 0x00FF);  //TimerValue (low byte)
        sendBuff[12 + i*3] = (BYTE)((inTimerValue[i] & 0xFF00)/256);  //TimerValue (high byte)
    }

    for( i = 0; i < 2; i++ )
        sendBuff[28 + i] = inCounterMode[i];  //CounterMode

    extendedChecksum(sendBuff, 30);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 30);
    if( sendChars < 30 )
    {
        if( sendChars == 0 )
            printf("ehTimerCounter error : write failed\n");
        else
            printf("ehTimerCounter error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 40);
    if( recChars < 40 )
    {
        if( recChars == 0 )
            printf("ehTimerCounter error : read failed\n");
        else
            printf("ehTimerCounter error : did not read all of the buffer\n");
        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 40);
    if( (BYTE)((checksumTotal / 256) & 0xFF) != recBuff[5] )
    {
        printf("ehTimerCounter error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (BYTE)(checksumTotal & 0xFF) != recBuff[4] )
    {
        printf("ehTimerCounter error : read buffer has bad checksum16(LBS)\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("ehTimerCounter error : read buffer has bad checksum8\n");
        return -1;
    }

    if( recBuff[1] != (BYTE)(0xF8) || recBuff[2] != (BYTE)(0x11) || recBuff[3] != (BYTE)(0x18) )
    {
        printf("ehTimerCounter error : read buffer has wrong command bytes for TimerCounter\n");
        return -1;
    }

    if( outTimer != NULL )
    {
        for( i = 0; i < 6; i++ )
        {
            outTimer[i] = 0;
            for( j = 0; j < 4; j++ )
                outTimer[i] += recBuff[8 + j + i*4] * pow(2, 8*j);
        }
    }

    if( outCounter != NULL )
    {
        for( i = 0; i < 2; i++ )
        {
            outCounter[i] = 0;
            for( j = 0; j < 4; j++ )
                outCounter[i] += recBuff[32 + j + i*4] * pow(2, 8*j);
        }
    }

    return recBuff[6];
}
