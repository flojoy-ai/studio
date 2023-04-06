//Author : LabJack
//May 25, 2011
//This example demonstrates how to write and read some or all analog and digital
//I/O.  It records the time for 1000 iterations and divides by 1000, to allow
//measurement of the basic command/response communication times.  These times
//should be comparable to the Windows command/response communication times
//documented in Section 3.1 of the UE9 User's Guide.

#include "ue9.h"


int allIO(HANDLE hDevice, ue9CalibrationInfo *caliInfo);

int main(int argc, char **argv)
{
    HANDLE hDevice;
    ue9CalibrationInfo caliInfo;

    //Opening first found UE9 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        goto done;

    //Getting calibration information from UE9
    if( getCalibrationInfo(hDevice, &caliInfo) < 0 )
        goto close;

    allIO(hDevice, &caliInfo);

close:
    closeUSBConnection(hDevice);
done:
    return 0;
}

//Sends 1000 Feedback low-level commands to read digital IO and analog inputs.
//On the first send, the following are set: DAC0 to 2.5 volts, DAC1 to 3.5
//volts, and digital IOs to inputs.
int allIO(HANDLE hDevice, ue9CalibrationInfo *caliInfo)
{
    uint8 sendBuff[34], recBuff[64], settlingTime;
    uint8 numChannels;  //Number of AIN channels, 0-16.
    uint16 checksumTotal, bytesVoltage, ainMask;
    int sendChars, recChars, i, j;
    int initialize;  //boolean to init. DAC and digital IO settings
    int numIterations, valueDIPort;
    long time, ainResolution;
    double valueAIN[16];

    numIterations = 1000;
    initialize = 1;
    time = 0;
    numChannels = 8; 
    ainResolution = 12;
    for( i = 0; i < 16; i++ )
        valueAIN[i] = 9999.0;
    settlingTime = 0;
    ainMask = pow(2.0, numChannels) - 1;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x0E);  //Number of data words
    sendBuff[3] = (uint8)(0x00);  //Extended command number

    sendBuff[6] = 255;  //FIOMask : setting the mask of all FIOs
    sendBuff[7] = 0;    //FIODir : setting all FIO directions to input
    sendBuff[8] = 0;    //FIOState : all FIO directions are input, so
                        //           state writes do not apply
    sendBuff[9] = 255;  //EIOMask : setting the mask of all EIOs
    sendBuff[10] = 0;   //EIODir : setting all EIO directions to input
    sendBuff[11] = 0;   //EIOState : all EIO directions are input, so
                        //           state writes do not apply
    sendBuff[12] = 15;  //CIOMask : setting the mask of all CIOs
    sendBuff[13] = 0;   //CIODirState : setting all CIO directions to input,
                        //              state writes do not apply

    sendBuff[14] = 7;   //MIOMask : setting the mask of all MIOs
    sendBuff[15] = 0;   //MIODirState : setting all MIO directions to input,
                        //              state writes do not apply

    //Getting binary DAC0 value of 2.5 volts 
    if( getDacBinVoltCalibrated(caliInfo, 0, 2.500, &bytesVoltage) < 0 )
        return -1;
    //Setting the voltage of DAC0 to 2.5
    sendBuff[16] = (uint8)(bytesVoltage & 255);      //low bits of DAC0
    sendBuff[17] = (uint8)(bytesVoltage/256) + 192;  //high bits of DAC0 
                                                     //(bit 7 : Enable,
                                                     // bit 6: Update)
    //Getting binary DAC1 value of 3.5 volts
    if( getDacBinVoltCalibrated(caliInfo, 1, 3.500, &bytesVoltage) < 0 )
        return -1;
    //Setting the voltage of DAC1 to 3.5 volts
    sendBuff[18] = (uint8)(bytesVoltage & 255);      //low bits of DAC1
    sendBuff[19] = (uint8)(bytesVoltage/256) + 192;  //high bits of DAC1 
                                                     //(bit 7 : Enable,
                                                     // bit 6: Update)

    //AINMask - reading the number of AINs specified by numChannels
    sendBuff[20] = ainMask & 255;  //AINMask (low byte)
    sendBuff[21] = ainMask/256;    //AINMask (high byte)
    sendBuff[22] = 14;             //AIN14ChannelNumber :  setting to channel 14
    sendBuff[23] = 15;             //AIN15ChannelNumber :  setting to channel 15
    sendBuff[24] = ainResolution;  //Resolution : Resolution specified by
                                   //             ainResolution
    sendBuff[25] = settlingTime;   //SettlingTime

    //Setting all BipGains (Gain = 1, Bipolar = 1) 
    for( i = 26; i < 34; i++ )
        sendBuff[i] = (uint8)(0x00);

    extendedChecksum(sendBuff, 34);

    time = getTickCount();

    for( i = 0; i < numIterations; i++ )
    {
        //Sending command to UE9
        sendChars = LJUSB_Write(hDevice, sendBuff, 34);
        if( sendChars < 34 )
        {
            if( sendChars == 0 )
                printf("Feedback error (Iteration %d) : write failed\n", i);
            else
                printf("Feedback error (Iteration %d) : did not write all of the buffer\n", i);
            return -1;
        }

        //Reading response from UE9
        recChars = LJUSB_Read(hDevice, recBuff, 64);
        if( recChars < 64 )
        {
            if( recChars == 0 )
                printf("Feedback error (Iteration %d) : read failed\n", i);
            else
                printf("Feedback error (Iteration %d) : did not read all of the buffer\n", i);
            return -1;
        }

        checksumTotal = extendedChecksum16(recBuff, 64);
        if( (uint8)((checksumTotal / 256) & 0xff) != recBuff[5] )
        {
            printf("Feedback error (Iteration %d) : read buffer has bad checksum16(MSB)\n", i);
            return -1;
        }

        if( (uint8)(checksumTotal & 255) != recBuff[4] )
        {
            printf("Feedback error (Iteration %d) : read buffer has bad checksum16(LSB)\n", i);
            return -1;
        }

        if( extendedChecksum8(recBuff) != recBuff[0] )
        {
            printf("Feedback error (Iteration %d) : read buffer has bad checksum8\n", i);
            return -1;
        }

        if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != (uint8)(0x1D) || recBuff[3] != (uint8)(0x00) )
        {
            printf("Feedback error (Iteration %d) : read buffer has wrong command bytes\n", i);
            return -1;
        }

        for( j = 0; j < numChannels && j < 16; j++ )
            getAinVoltCalibrated(caliInfo, 0x00, (uint8)ainResolution, recBuff[12 + j*2] + recBuff[13 + j*2]*256, &valueAIN[j]);

        valueDIPort = recBuff[7] + recBuff[9]*256 + (recBuff[10] & 15)*65536 + (recBuff[11] & 7)*1048576;

        if( initialize == 1 )
        {
            //Unsetting digital IO bit masks since we only want to read states now 
            sendBuff[6] = 0;   //FIOMask 
            sendBuff[9] = 0;   //EIOMask
            sendBuff[12] = 0;  //CIOMask 
            sendBuff[14] = 0;  //MIOMask 

            //Turning off Update bit of DACs
            sendBuff[17] = sendBuff[17] - 64;  //high bits of DAC0  
            sendBuff[19] = sendBuff[19] - 64;  //high bits of DAC1 

            extendedChecksum(sendBuff, 34);

            initialize = 0;
        }
    }

    time = getTickCount() - time;

    printf("Milleseconds per iteration = %.3f\n", (double)time / (double)numIterations);
    printf("\nDigital Input (FIO0-7, EIO0-7, CIO0-3, MIO0-2)  = %d\n",valueDIPort);
    printf("\nAIN readings from last iteration:\n");
    for( j = 0; j < numChannels; j++ )
        printf("%.3f\n", valueAIN[j]);

    return 0;
}
