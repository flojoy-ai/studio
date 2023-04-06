//Author: LabJack
//April 5, 2011
//This example program reads analog inputs AI0-AI4 using stream mode.

#include "u6.h"


int ConfigIO_example(HANDLE hDevice);
int StreamConfig_example(HANDLE hDevice);
int StreamStart(HANDLE hDevice);
int StreamData_example(HANDLE hDevice, u6CalibrationInfo *caliInfo);
int StreamStop(HANDLE hDevice);

const uint8 NumChannels = 5;        //For this example to work proper, SamplesPerPacket needs
                                    //to be a multiple of NumChannels.
const uint8 SamplesPerPacket = 25;  //Needs to be 25 to read multiple StreamData responses
                                    //in one large packet, otherwise can be any value between
                                    //1-25 for 1 StreamData response per packet.

int main(int argc, char **argv)
{
    HANDLE hDevice;
    u6CalibrationInfo caliInfo;

    //Opening first found U6 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        goto done;

    //Getting calibration information from U6
    if( getCalibrationInfo(hDevice, &caliInfo) < 0 )
        goto close;

    if( ConfigIO_example(hDevice) != 0 )
        goto close;

    //Stopping any previous streams
    StreamStop(hDevice);

    if( StreamConfig_example(hDevice) != 0 )
        goto close;

    if( StreamStart(hDevice) != 0 )
        goto close;

    StreamData_example(hDevice, &caliInfo);
    StreamStop(hDevice);

close:
    closeUSBConnection(hDevice);
done:
    return 0;
}

//Sends a ConfigIO low-level command to turn off timers/counters
int ConfigIO_example(HANDLE hDevice)
{
    uint8 sendBuff[16], recBuff[16];
    uint16 checksumTotal;
    int sendChars, recChars, i;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x05);  //Number of data words
    sendBuff[3] = (uint8)(0x0B);  //Extended command number

    sendBuff[6] = 1;  //Writemask : Setting writemask for TimerCounterConfig (bit 0)

    sendBuff[7] = 0;  //NumberTimersEnabled : Setting to zero to disable all timers.
    sendBuff[8] = 0;  //CounterEnable: Setting bit 0 and bit 1 to zero to disable both counters
    sendBuff[9] = 0;  //TimerCounterPinOffset

    for( i = 10; i < 16; i++ )
        sendBuff[i] = 0;   //Reserved
    extendedChecksum(sendBuff, 16);

    //Sending command to U6
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 16)) < 16 )
    {
        if( sendChars == 0 )
            printf("ConfigIO error : write failed\n");
        else
            printf("ConfigIO error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from U6
    if( (recChars = LJUSB_Read(hDevice, recBuff, 16)) < 16 )
    {
        if( recChars == 0 )
            printf("ConfigIO error : read failed\n");
        else
            printf("ConfigIO error : did not read all of the buffer\n");
        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 16);
    if( (uint8)((checksumTotal / 256 ) & 0xff) != recBuff[5] )
    {
        printf("ConfigIO error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xff) != recBuff[4] )
    {
        printf("ConfigIO error : read buffer has bad checksum16(LSB)\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("ConfigIO error : read buffer has bad checksum8\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != (uint8)(0x05) || recBuff[3] != (uint8)(0x0B) )
    {
        printf("ConfigIO error : read buffer has wrong command bytes\n");
        return -1;
    }

    if( recBuff[6] != 0 )
    {
        printf("ConfigIO error : read buffer received errorcode %d\n", recBuff[6]);
        return -1;
    }

    if( recBuff[8] != 0 )
    {
        printf("ConfigIO error : NumberTimersEnabled was not set to 0\n");
        return -1;
    }

    if( recBuff[9] != 0 )
    {
        printf("ConfigIO error : CounterEnable was not set to 0\n");
        return -1;
    }

    return 0;
}

//Sends a StreamConfig low-level command to configure the stream.
int StreamConfig_example(HANDLE hDevice)
{
    int sendBuffSize;
    sendBuffSize = 14+NumChannels*2;
    uint8 sendBuff[sendBuffSize], recBuff[8];
    int sendChars, recChars;
    uint16 checksumTotal;
    uint16 scanInterval;
    int i;

    sendBuff[1] = (uint8)(0xF8);     //Command byte
    sendBuff[2] = 4 + NumChannels;   //Number of data words = NumChannels + 4
    sendBuff[3] = (uint8)(0x11);     //Extended command number
    sendBuff[6] = NumChannels;       //NumChannels
    sendBuff[7] = 1;                 //ResolutionIndex
    sendBuff[8] = SamplesPerPacket;  //SamplesPerPacket
    sendBuff[9] = 0;                 //Reserved
    sendBuff[10] = 0;                //SettlingFactor: 0
    sendBuff[11] = 0;  //ScanConfig:
                       //  Bit 3: Internal stream clock frequency = b0: 4 MHz
                       //  Bit 1: Divide Clock by 256 = b0

    scanInterval = 4000;
    sendBuff[12] = (uint8)(scanInterval&(0x00FF));  //scan interval (low byte)
    sendBuff[13] = (uint8)(scanInterval/256);       //scan interval (high byte)

    for( i = 0; i < NumChannels; i++ )
    {
        sendBuff[14 + i*2] = i;  //ChannelNumber (Positive) = i
        sendBuff[15 + i*2] = 0;  //ChannelOptions: 
                                 //  Bit 7: Differential = 0
                                 //  Bit 5-4: GainIndex = 0 (+-10V)
    }

    extendedChecksum(sendBuff, sendBuffSize);

    //Sending command to U6
    sendChars = LJUSB_Write(hDevice, sendBuff, sendBuffSize);
    if( sendChars < sendBuffSize )
    {
        if( sendChars == 0 )
            printf("Error : write failed (StreamConfig).\n");
        else
            printf("Error : did not write all of the buffer (StreamConfig).\n");
        return -1;
    }

    for( i = 0; i < 8; i++ )
        recBuff[i] = 0;

    //Reading response from U6
    recChars = LJUSB_Read(hDevice, recBuff, 8);
    if( recChars < 8 )
    {
        if( recChars == 0 )
            printf("Error : read failed (StreamConfig).\n");
        else
            printf("Error : did not read all of the buffer, %d (StreamConfig).\n", recChars);

        for( i = 0; i < 8; i++)
            printf("%d ", recBuff[i]);

        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 8);
    if( (uint8)((checksumTotal / 256) & 0xff) != recBuff[5])
    {
        printf("Error : read buffer has bad checksum16(MSB) (StreamConfig).\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xff) != recBuff[4] )
    {
        printf("Error : read buffer has bad checksum16(LSB) (StreamConfig).\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("Error : read buffer has bad checksum8 (StreamConfig).\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != (uint8)(0x01) || recBuff[3] != (uint8)(0x11) || recBuff[7] != (uint8)(0x00) )
    {
        printf("Error : read buffer has wrong command bytes (StreamConfig).\n");
        return -1;
    }

    if( recBuff[6] != 0 )
    {
        printf("Errorcode # %d from StreamConfig read.\n", (unsigned int)recBuff[6]);
        return -1;
    }

    return 0;
}

//Sends a StreamStart low-level command to start streaming.
int StreamStart(HANDLE hDevice)
{
    uint8 sendBuff[2], recBuff[4];
    int sendChars, recChars;

    sendBuff[0] = (uint8)(0xA8);  //Checksum8
    sendBuff[1] = (uint8)(0xA8);  //Command byte

    //Sending command to U6
    sendChars = LJUSB_Write(hDevice, sendBuff, 2);
    if( sendChars < 2 )
    {
        if( sendChars == 0 )
            printf("Error : write failed.\n");
        else
            printf("Error : did not write all of the buffer.\n");
        return -1;
    }

    //Reading response from U6
    recChars = LJUSB_Read(hDevice, recBuff, 4);
    if( recChars < 4 )
    {
        if( recChars == 0 )
            printf("Error : read failed.\n");
        else
            printf("Error : did not read all of the buffer.\n");
        return -1;
    }

    if( normalChecksum8(recBuff, 4) != recBuff[0] )
    {
        printf("Error : read buffer has bad checksum8 (StreamStart).\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xA9) || recBuff[3] != (uint8)(0x00) )
    {
        printf("Error : read buffer has wrong command bytes \n");
        return -1;
    }

    if( recBuff[2] != 0 )
    {
        printf("Errorcode # %d from StreamStart read.\n", (unsigned int)recBuff[2]);
        return -1;
    }

    return 0;
}

//Reads the StreamData low-level function response in a loop.
//All voltages from the stream are stored in the voltages 2D array.
int StreamData_example(HANDLE hDevice, u6CalibrationInfo *caliInfo)
{
    int recBuffSize;
    recBuffSize = 14 + SamplesPerPacket*2;
    int recChars, backLog;
    int i, j, k, m, packetCounter, currChannel, scanNumber;
    int totalPackets;  //The total number of StreamData responses read
    uint16 voltageBytes, checksumTotal;
    long startTime, endTime;
    int autoRecoveryOn;

    int numDisplay;          //Number of times to display streaming information
    int numReadsPerDisplay;  //Number of packets to read before displaying streaming information
    int readSizeMultiplier;  //Multiplier for the StreamData receive buffer size
    int responseSize;        //The number of bytes in a StreamData response (differs with SamplesPerPacket)

    numDisplay = 6;
    numReadsPerDisplay = 24;
    readSizeMultiplier = 5;
    responseSize = 14 + SamplesPerPacket*2;

    /* Each StreamData response contains (SamplesPerPacket / NumChannels) * readSizeMultiplier
     * samples for each channel.
     * Total number of scans = (SamplesPerPacket / NumChannels) * readSizeMultiplier * numReadsPerDisplay * numDisplay
     */
    double voltages[(SamplesPerPacket/NumChannels)*readSizeMultiplier*numReadsPerDisplay*numDisplay][NumChannels];
    uint8 recBuff[responseSize*readSizeMultiplier];
    packetCounter = 0;
    currChannel = 0;
    scanNumber = 0;
    totalPackets = 0;
    recChars = 0;
    autoRecoveryOn = 0;

    printf("Reading Samples...\n");

    startTime = getTickCount();

    for( i = 0; i < numDisplay; i++ )
    {
        for( j = 0; j < numReadsPerDisplay; j++ )
        {
            /* For USB StreamData, use Endpoint 3 for reads.  You can read the multiple
             * StreamData responses of 64 bytes only if SamplesPerPacket is 25 to help
             * improve streaming performance.  In this example this multiple is adjusted
             * by the readSizeMultiplier variable.
             */

            //Reading stream response from U6
            recChars = LJUSB_Stream(hDevice, recBuff, responseSize*readSizeMultiplier);
            if( recChars < responseSize*readSizeMultiplier )
            {
                if(recChars == 0)
                    printf("Error : read failed (StreamData).\n");
                else
                    printf("Error : did not read all of the buffer, expected %d bytes but received %d(StreamData).\n", responseSize*readSizeMultiplier, recChars);

                return -1;
            }

            //Checking for errors and getting data out of each StreamData response
            for( m = 0; m < readSizeMultiplier; m++ )
            {
                totalPackets++;

                checksumTotal = extendedChecksum16(recBuff + m*recBuffSize, recBuffSize);
                if( (uint8)((checksumTotal >> 8) & 0xff) != recBuff[m*recBuffSize + 5] )
                {
                    printf("Error : read buffer has bad checksum16(MSB) (StreamData).\n");
                    return -1;
                }

                if( (uint8)(checksumTotal & 0xff) != recBuff[m*recBuffSize + 4] )
                {
                    printf("Error : read buffer has bad checksum16(LSB) (StreamData).\n");
                    return -1;
                }

                checksumTotal = extendedChecksum8(recBuff + m*recBuffSize);
                if( checksumTotal != recBuff[m*recBuffSize] )
                {
                    printf("Error : read buffer has bad checksum8 (StreamData).\n");
                    return -1;
                }

                if( recBuff[m*recBuffSize + 1] != (uint8)(0xF9) || recBuff[m*recBuffSize + 2] != 4 + SamplesPerPacket || recBuff[m*recBuffSize + 3] != (uint8)(0xC0) )
                {
                    printf("Error : read buffer has wrong command bytes (StreamData).\n");
                    return -1;
                }

                if( recBuff[m*recBuffSize + 11] == 59 )
                {
                    if( !autoRecoveryOn )
                    {
                        printf("\nU6 data buffer overflow detected in packet %d.\nNow using auto-recovery and reading buffered samples.\n", totalPackets);
                        autoRecoveryOn = 1;
                    }
                }
                else if( recBuff[m*recBuffSize + 11] == 60 )
                {
                    printf("Auto-recovery report in packet %d: %d scans were dropped.\nAuto-recovery is now off.\n", totalPackets, recBuff[m*recBuffSize + 6] + recBuff[m*recBuffSize + 7]*256);
                    autoRecoveryOn = 0;
                }
                else if( recBuff[m*recBuffSize + 11] != 0 )
                {
                    printf("Errorcode # %d from StreamData read.\n", (unsigned int)recBuff[11]);
                    return -1;
                }

                if( packetCounter != (int)recBuff[m*recBuffSize + 10] )
                {
                    printf("PacketCounter (%d) does not match with with current packet count (%d)(StreamData).\n", recBuff[m*recBuffSize + 10], packetCounter);
                    return -1;
                }

                backLog = (int)recBuff[m*48 + 12 + SamplesPerPacket*2];

                for( k = 12; k < (12 + SamplesPerPacket*2); k += 2 )
                {
                    voltageBytes = (uint16)recBuff[m*recBuffSize + k] + (uint16)recBuff[m*recBuffSize + k+1]*256;

                    getAinVoltCalibrated(caliInfo, 1, 0, 0, voltageBytes, &(voltages[scanNumber][currChannel]));

                    currChannel++;
                    if( currChannel >= NumChannels )
                    {
                        currChannel = 0;
                        scanNumber++;
                    }
                }

                if(packetCounter >= 255)
                    packetCounter = 0;
                else
                    packetCounter++;
            }
        }

        printf("\nNumber of scans: %d\n", scanNumber);
        printf("Total packets read: %d\n", totalPackets);
        printf("Current PacketCounter: %d\n", ((packetCounter == 0) ? 255 : packetCounter-1));
        printf("Current BackLog: %d\n", backLog);

        for( k = 0; k < NumChannels; k++ )
            printf("  AI%d: %.4f V\n", k, voltages[scanNumber - 1][k]);
    }

    endTime = getTickCount();
    printf("\nRate of samples: %.0lf samples per second\n", (scanNumber*NumChannels)/((endTime - startTime)/1000.0));
    printf("Rate of scans: %.0lf scans per second\n\n", scanNumber/((endTime - startTime)/1000.0));

    return 0;
}

//Sends a StreamStop low-level command to stop streaming.
int StreamStop(HANDLE hDevice)
{
    uint8 sendBuff[2], recBuff[4];
    int sendChars, recChars;

    sendBuff[0] = (uint8)(0xB0);  //Checksum8
    sendBuff[1] = (uint8)(0xB0);  //Command byte

    //Sending command to U6
    sendChars = LJUSB_Write(hDevice, sendBuff, 2);
    if( sendChars < 2 )
    {
        if( sendChars == 0 )
            printf("Error : write failed (StreamStop).\n");
        else
            printf("Error : did not write all of the buffer (StreamStop).\n");
        return -1;
    }

    //Reading response from U6
    recChars = LJUSB_Read(hDevice, recBuff, 4);
    if( recChars < 4 )
    {
        if( recChars == 0 )
            printf("Error : read failed (StreamStop).\n");
        else
            printf("Error : did not read all of the buffer (StreamStop).\n");
        return -1;
    }

    if( normalChecksum8(recBuff, 4) != recBuff[0] )
    {
        printf("Error : read buffer has bad checksum8 (StreamStop).\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xB1) || recBuff[3] != (uint8)(0x00) )
    {
        printf("Error : read buffer has wrong command bytes (StreamStop).\n");
        return -1;
    }

    if( recBuff[2] != 0 )
    {
        printf("Errorcode # %d from StreamStop read.\n", (unsigned int)recBuff[2]);
        return -1;
    }

    /*
    //Reading left over data in stream endpoint.  Only needs to be done with firmwares
    //less than 0.94.
    uint8 recBuffS[64];
    int recCharsS = 64;
    printf("Reading left over data from stream endpoint.\n");
    while( recCharsS > 0 )
        recCharsS = LJUSB_Stream(hDevice, recBuffS, 64);
    */

    return 0;
}
