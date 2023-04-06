//Author : LabJack
//December 27, 2011
//This example demonstrates how to write and read some or all analog and digital
//I/O.  It records the time for 1000 iterations and divides by 1000, to allow
//measurement of the basic command/response communication times.  These times
//should be comparable to the Windows command/response communication times
//documented in Section 3.1 of the U3 User's Guide.

#include <stdlib.h>
#include "u3.h"


const uint8 numChannels = 8;  //Number of AIN channels, 0-16.
const uint8 quickSample = 1;  //Set to TRUE for quick AIN sampling.
const uint8 longSettling = 0;  //Set to TRUE for extra AIN settling time.

int configAllIO(HANDLE hDevice, int *isDAC1Enabled);
int allIO(HANDLE hDevice, u3CalibrationInfo *caliInfo, int isDAC1Enabled);

int main(int argc, char **argv)
{
    HANDLE hDevice;
    u3CalibrationInfo caliInfo;
    int dac1Enabled;

    //Opening first found U3 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        goto done;

    //Getting calibration information from U3
    if( getCalibrationInfo(hDevice, &caliInfo) < 0 )
        goto close;

    if( configAllIO(hDevice, &dac1Enabled) < 0 )
        goto close;;

    allIO(hDevice, &caliInfo, dac1Enabled);

close:
    closeUSBConnection(hDevice);
done:
    return 0;
}

//Sends a ConfigIO low-level command that will set desired lines as analog, and
//all else as digital.
int configAllIO(HANDLE hDevice, int *isDAC1Enabled)
{
    uint8 sendBuff[12], recBuff[12];
    uint16 checksumTotal, FIOEIOAnalog;
    int sendChars, recChars;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x03);  //Number of data words
    sendBuff[3] = (uint8)(0x0B);  //Extended command number

    sendBuff[6] = 13;  //Writemask : Setting writemask for TimerCounterConfig (bit 0),
                       //            FIOAnalog (bit 2) and EIOAnalog (bit 3)

    sendBuff[7] = 0;  //Reserved
    sendBuff[8] = 64;  //TimerCounterConfig: disable timer and counter, set
                       //                    TimerCounterPinOffset to 4 (bits 4-7)
    sendBuff[9] = 0;  //DAC1 enable : not enabling, though could already be enabled

    sendBuff[10] = 0;

    FIOEIOAnalog = pow(2.0, numChannels)-1;
    sendBuff[10] = (FIOEIOAnalog & 0xFF);  //FIOAnalog
    sendBuff[11] = FIOEIOAnalog / 256;  //EIOAnalog
    extendedChecksum(sendBuff, 12);

    //Sending command to U3
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 12)) < 12 )
    {
        if( sendChars == 0 )
            printf("ConfigIO error : write failed\n");
        else
            printf("ConfigIO error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from U3
    if( (recChars = LJUSB_Read(hDevice, recBuff, 12)) < 12 )
    {
        if( recChars == 0 )
            printf("ConfigIO error : read failed\n");
        else
            printf("ConfigIO error : did not read all of the buffer\n");
        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 12);
    if( (uint8)((checksumTotal / 256) & 0xFF) != recBuff[5] )
    {
        printf("ConfigIO error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xFF) != recBuff[4] )
    {
        printf("ConfigIO error : read buffer has bad checksum16(LBS)\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("ConfigIO error : read buffer has bad checksum8\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != (uint8)(0x03) || recBuff[3] != (uint8)(0x0B) )
    {
        printf("ConfigIO error : read buffer has wrong command bytes\n");
        return -1;
    }

    if( recBuff[6] != 0 )
    {
        printf("ConfigIO error : read buffer received errorcode %d\n", recBuff[6]);
        return -1;
    }

    if( recBuff[10] != (FIOEIOAnalog&(0xFF)) && recBuff[10] != ((FIOEIOAnalog&(0xFF))|(0x0F)) )
    {
        printf("ConfigIO error : FIOAnalog did not set correctly");
        return -1;
    }

    if( recBuff[11] != FIOEIOAnalog/256 )
    {
        printf("ConfigIO error : EIOAnalog did not set correctly");
        return -1;
    }

    *isDAC1Enabled = (int)recBuff[9];

    return 0;
}

//Calls a Feedback low-level command 1000 times.
int allIO(HANDLE hDevice, u3CalibrationInfo *caliInfo, int isDAC1Enabled)
{
    uint8 *sendBuff, *recBuff;
    uint16 checksumTotal, ainBytes;
    int sendChars, recChars, sendSize, recSize;
    int valueDIPort, ret, i, j;
    double valueAIN[16];
    long time, numIterations;
    double hardwareVersion;

    ret = 0;
    hardwareVersion = caliInfo->hardwareVersion;

    for( i = 0; i < 16; i++ )
        valueAIN[i] = 9999;
    valueDIPort = 0;
    numIterations = 1000;  //Number of iterations (how many times Feedback will
                           //be called)

    //Setting up a Feedback command that will set CIO0-3 as input
    sendBuff = (uint8 *)malloc(14*sizeof(uint8));  //Creating an array of size 14
    recBuff = (uint8 *)malloc(10*sizeof(uint8));  //Creating an array of size 10

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = 4;  //Number of data words (.5 word for echo, 3.5 words for
                      //                      IOTypes and data)
    sendBuff[3] = (uint8)(0x00);  //Extended command number

    sendBuff[6] = 0;  //Echo
    sendBuff[7] = 29;  //IOType is PortDirWrite
    sendBuff[8] = 0;  //Writemask (for FIO)
    sendBuff[9] = 0;  //Writemask (for EIO)
    sendBuff[10] = 15;  //Writemask (for CIO)
    sendBuff[11] = 0;  //Direction (for FIO)
    sendBuff[12] = 0;  //Direction (for EIO)
    sendBuff[13] = 0;  //Direction (for CIO)

    extendedChecksum(sendBuff, 14);

    //Sending command to U3
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 14)) < 14 )
    {
        if( sendChars == 0 )
            printf("Feedback (CIO input) error : write failed\n");
        else
            printf("Feedback (CIO input) error : did not write all of the buffer\n");
        ret = -1;
        goto cleanmem;
    }

    //Reading response from U3
    if( (recChars = LJUSB_Read(hDevice, recBuff, 10)) < 10 )
    {
        if( recChars == 0 )
        {
            printf("Feedback (CIO input) error : read failed\n");
            ret = -1;
            goto cleanmem;
        }
        else
            printf("Feedback (CIO input) error : did not read all of the buffer\n");
    }

    checksumTotal = extendedChecksum16(recBuff, 10);
    if( (uint8)((checksumTotal / 256) & 0xFF) != recBuff[5] )
    {
        printf("Feedback (CIO input) error : read buffer has bad checksum16(MSB)\n");
        ret = -1;
        goto cleanmem;
    }

    if( (uint8)(checksumTotal & 0xFF) != recBuff[4] )
    {
        printf("Feedback (CIO input) error : read buffer has bad checksum16(LBS)\n");
        ret = -1;
        goto cleanmem;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("Feedback (CIO input) error : read buffer has bad checksum8\n");
        ret = -1;
        goto cleanmem;
    }

    if( recBuff[1] != (uint8)(0xF8) || recBuff[3] != (uint8)(0x00) )
    {
        printf("Feedback (CIO input) error : read buffer has wrong command bytes \n");
        ret = -1;
        goto cleanmem;
    }

    if( recBuff[6] != 0 )
    {
        printf("Feedback (CIO input) error : received errorcode %d for frame %d in Feedback response. \n", recBuff[6], recBuff[7]);
        ret = -1;
        goto cleanmem;
    }

    free(sendBuff);
    free(recBuff);

    //Setting up Feedback command that will run 1000 times
    if( ((sendSize = 7+2+1+numChannels*3) % 2) != 0 )
        sendSize++;
    //Creating an array of size sendSize
    sendBuff = (uint8 *)malloc(sendSize*sizeof(uint8));

    if( ((recSize = 9+3+numChannels*2) % 2) != 0 )
        recSize++;
    //Creating an array of size recSize
    recBuff = (uint8 *)malloc(recSize*sizeof(uint8));

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (sendSize - 6)/2;  //Number of data words 
    sendBuff[3] = (uint8)(0x00);  //Extended command number

    sendBuff[6] = 0;  //Echo

    //Setting DAC0 with 2.5 volt output
    sendBuff[7] = 34;  //IOType is DAC0

    //Value is 2.5 volts (in binary)
    getDacBinVoltCalibrated(caliInfo, 0, 2.5, &sendBuff[8]);

    sendBuff[9] = 26;    //IOType is PortStateRead

    //Setting AIN read commands
    for( j = 0; j < numChannels; j++ )
    {
        sendBuff[10 + j*3] = 1;  //IOType is AIN

        //Positive Channel (bits 0 - 4), LongSettling (bit 6) and QuickSample (bit 7)
        sendBuff[11 + j*3] = j + (longSettling&(0x01))*64 + (quickSample&(0x01))*128;
        sendBuff[12 + j*3] = 31;  //Negative Channel is single-ended
    }

    if( (sendSize % 2) != 0 )
        sendBuff[sendSize - 1] = 0;

    extendedChecksum(sendBuff, sendSize);

    time = getTickCount();

    for( i = 0; i < numIterations; i++ )
    {
        //Sending command to U3
        if( (sendChars = LJUSB_Write(hDevice, sendBuff, sendSize)) < sendSize )
        {
            if( sendChars == 0 )
                printf("Feedback error (Iteration %d): write failed\n", i);
            else
                printf("Feedback error (Iteration %d): did not write all of the buffer\n", i);
            ret = -1;
            goto cleanmem;
        }

        //Reading response from U3
        if( (recChars = LJUSB_Read(hDevice, recBuff, recSize)) < recSize )
        {
            if( recChars == 0 )
            {
                printf("Feedback error (Iteration %d): read failed\n", i);
                ret = -1;
                goto cleanmem;
            }
            else
                printf("Feedback error (Iteration %d): did not read all of the expected buffer\n", i);
        }

        checksumTotal = extendedChecksum16(recBuff, recChars);
        if( (uint8)((checksumTotal / 256) & 0xFF) != recBuff[5] )
        {
            printf("Feedback error (Iteration %d): read buffer has bad checksum16(MSB)\n", i);
            ret = -1;
            goto cleanmem;
        }

        if( (uint8)(checksumTotal & 0xFF) != recBuff[4] )
        {
            printf("Feedback error (Iteration %d): read buffer has bad checksum16(LBS)\n", i);
            ret = -1;
            goto cleanmem; 
        }

        if( extendedChecksum8(recBuff) != recBuff[0] )
        {
            printf("Feedback error (Iteration %d): read buffer has bad checksum8\n", i);
            ret = -1;
            goto cleanmem;
        }

        if( recBuff[1] != (uint8)(0xF8) || recBuff[3] != (uint8)(0x00) )
        {
            printf("Feedback error (Iteration %d): read buffer has wrong command bytes \n", i);
            ret = -1;
            goto cleanmem;
        }

        if( recBuff[6] != 0 )
        {
            printf("Feedback error (Iteration %d): received errorcode %d for frame %d in Feedback response. \n", i, recBuff[6], recBuff[7]);
            ret = -1;
            goto cleanmem;
        }

        if( recChars != recSize )
        {
            ret = -1;
            goto cleanmem;
        }

        //Getting CIO digital states
        valueDIPort = recBuff[11];

        //Getting AIN voltages
        for( j = 0; j < numChannels; j++ )
        {
            ainBytes = recBuff[12+j*2] + recBuff[13+j*2]*256;
            if( hardwareVersion >= 1.30 )
                getAinVoltCalibrated_hw130(caliInfo, j, 31, ainBytes, &valueAIN[j]);
            else
                getAinVoltCalibrated(caliInfo, isDAC1Enabled, 31, ainBytes, &valueAIN[j]);
        }
    }

    time = getTickCount() - time;
    printf("Milliseconds per iteration = %.3f\n", (double)time / (double)numIterations);
    printf("\nDigital Input = %d\n", valueDIPort);
    printf("\nAIN readings from last iteration:\n");

    for( j = 0; j < numChannels; j++ )
        printf("%.3f\n", valueAIN[j]);

cleanmem:
    free(sendBuff);
    free(recBuff);
    sendBuff = NULL;
    recBuff = NULL;

    return ret;
}
