//Author: LabJack
//April 17, 2012
//This example program reads analog inputs AI0-AI3 using stream mode.

#include "ue9.h"
#include <math.h>
#include <stdio.h>

int StreamConfig_example(HANDLE hDevice);
int StreamStart(HANDLE hDevice);
int StreamData_example(HANDLE hDevice, ue9CalibrationInfo *caliInfo);
int StreamStop(HANDLE hDevice);
int flushStream(HANDLE hDevice);
int doFlush(HANDLE hDevice);

const int AIN_RESOLUTION = 12;
const uint8 NUM_CHANNELS = 4;  //Set this to a value between 1-16.  Readings
                               //are performed on AIN channels 0-(NUM_CHANNELS-1).

int main(int argc, char **argv)
{
    HANDLE hDevice;
    ue9CalibrationInfo caliInfo;

    //Opening first found UE9 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        goto done;

    doFlush(hDevice);

    //Getting calibration information from UE9
    if( getCalibrationInfo(hDevice, &caliInfo) < 0 )
        goto close;

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

//Sends a StreamConfig low-level command to configure the stream to read only 4
//analog inputs (AI0 - AI3).
int StreamConfig_example(HANDLE hDevice)
{
    int sendBuffSize;
    sendBuffSize = 12 + 2*NUM_CHANNELS;
    uint8 sendBuff[sendBuffSize], recBuff[8];
    uint16 checksumTotal, scanInterval;
    int sendChars, recChars, i;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = NUM_CHANNELS + 3;  //Number of data words : NUM_CHANNELS + 3
    sendBuff[3] = (uint8)(0x11);  //Extended command number
    sendBuff[6] = (uint8)NUM_CHANNELS;  //NumChannels
    sendBuff[7] = AIN_RESOLUTION;  //Resolution
    sendBuff[8] = 0;  //SettlingTime = 0
    sendBuff[9] = 0;  //ScanConfig: scan pulse and external scan
                      //trigger disabled stream clock
                      //frequency = 4 MHz

    scanInterval = 4000;
    sendBuff[10] = (uint8)(scanInterval&0x00FF);  //Scan interval (low byte)
    sendBuff[11] = (uint8)(scanInterval/256);  //Scan interval (high byte)

    for( i = 0; i < NUM_CHANNELS; i++ )
    {
        sendBuff[12 + i*2] = i;  //channel # = i
        sendBuff[13 + i*2] = 0;  //BipGain (Bip = unipolar, Gain = 1)
    }

    extendedChecksum(sendBuff, sendBuffSize);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, sendBuffSize);
    if( sendChars < sendBuffSize )
    {
        if( sendChars == 0 )
            printf("Error : write failed (StreamConfig).\n");
        else
            printf("Error : did not write all of the buffer (StreamConfig).\n");
        return -1;
    } 

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 8);
    if( recChars < 8 )
    {
        if( recChars == 0 )
            printf("Error : read failed (StreamConfig).\n");
        else
            printf("Error : did not read all of the buffer (StreamConfig).\n");
        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 8);
    if( (uint8)((checksumTotal / 256) & 0xff) != recBuff[5] )
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

    if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != (uint8)(0x01) || recBuff[3] != (uint8)(0x11) )
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

    sendBuff[0] = (uint8)(0xA8);  //CheckSum8
    sendBuff[1] = (uint8)(0xA8);  //Command byte

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 2);
    if( sendChars < 2 )
    {
        if( sendChars == 0 )
            printf("Error : write failed (StreamStart).\n");
        else
            printf("Error : did not write all of the buffer (StreamStart).\n");
        return -1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 4);
    if( recChars < 4 )
    {
        if( recChars == 0 )
            printf("Error : read failed (StreamStart).\n");
        else
            printf("Error : did not read all of the buffer (StreamStart).\n");
        return -1;
    }

    if( normalChecksum8(recBuff, 4) != recBuff[0] )
    {
        printf("Error : read buffer has bad checksum8 (StreamStart).\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xA9) )
    {
        printf("Error : read buffer has wrong command byte (StreamStart).\n");
        return -1;
    }

    if( recBuff[2] != 0 )
    {
        printf("Errorcode # %d from StreamStart read.\n", (unsigned int)recBuff[2]);
        return -1;
    }

    return 0;
}

//Reads the StreamData low-level function response in a loop.  All voltages
//from the stream are stored in the voltages 2D array.
int StreamData_example(HANDLE hDevice, ue9CalibrationInfo *caliInfo)
{
    uint16 voltageBytes, checksumTotal;
    int recChars, backLog, overflow;
    int i, j, k, m, packetCounter, currChannel, scanNumber;
    int totalPackets;  //The total number of StreamData responses read
    int numDisplay;  //Number of times to display streaming information
    int numReadsPerDisplay;  //Number of packets to read before displaying
                             //streaming information
    int readSizeMultiplier;  //Multiplier for the StreamData receive buffer size
    int totalScans;  //Total scans that will be read  Meant for calculating the
                     //size of the voltages array.
    long startTime, endTime;

    packetCounter = 0;
    currChannel = 0;
    scanNumber = 0;
    totalPackets = 0;
    recChars = 0;
    numDisplay = 6;
    numReadsPerDisplay = 3;
    readSizeMultiplier = 10;

    /* Each StreamData response contains (16/NUM_CHANNELS) * readSizeMultiplier
     * samples for each channel.
     * Total number of scans = (16 / NUM_CHANNELS) * 4 * readSizeMultiplier * numReadsPerDisplay * numDisplay
     */
    totalScans = ceil((16.0/NUM_CHANNELS)*4.0*readSizeMultiplier*numReadsPerDisplay*numDisplay);
    double voltages[totalScans][NUM_CHANNELS];
    uint8 recBuff[192*readSizeMultiplier];

    printf("Reading Samples...\n");

    startTime = getTickCount();

    for( i = 0; i < numDisplay; i++ )
    {
        for( j = 0; j < numReadsPerDisplay; j++ )
        {
            /* For USB StreamData, use Endpoint 2 for reads and 192 byte
             * packets instead of the 46.  The 192 byte response is 4
             * StreamData packet responses of 48 bytes.
             * You can read the multiple StreamData responses of 192 bytes to
             * help improve streaming performance.  In this example this
             * multiple is adjusted by the readSizeMultiplier variable.
             */

            //Reading response from UE9
            recChars = LJUSB_Stream(hDevice, recBuff, 192*readSizeMultiplier);
            if( recChars < 192*readSizeMultiplier )
            {
                if( recChars == 0 )
                    printf("Error : read failed (StreamData).\n");
                else
                    printf("Error : did not read all of the buffer %d (StreamData).\n", recChars);
                return -1;
            }

            overflow = 0;

            //Checking for errors and getting data out of each StreamData response
            for( m = 0; m < 4*readSizeMultiplier; m++ )
            {
                totalPackets++;
                checksumTotal = extendedChecksum16(recBuff + m*48, 46);
                if( (uint8)((checksumTotal >> 8) & 0xff) != recBuff[m*48 + 5] )
                {
                    printf("Error : read buffer has bad checksum16(MSB) (StreamData).\n");
                    return -1;
                }

                if( (uint8)(checksumTotal & 0xff) != recBuff[m*48 + 4] )
                {
                    printf("Error : read buffer has bad checksum16(LSB) (StreamData).\n");
                    return -1;
                }

                checksumTotal = extendedChecksum8(recBuff + m*48);
                if( checksumTotal != recBuff[m*48] )
                {
                    printf("Error : read buffer has bad checksum8 (StreamData).\n");
                    return -1;
                }

                if( recBuff[m*48 + 1] != (uint8)(0xF9) || recBuff[m*48 + 2] != (uint8)(0x14) || recBuff[m*48 + 3] != (uint8)(0xC0) )
                {
                    printf("Error : read buffer has wrong command bytes (StreamData).\n");
                    return -1;
                }

                if( recBuff[m*48 + 11] != 0 )
                {
                    printf("Errorcode # %d from StreamData read.\n", (unsigned int)recBuff[11]);
                    return -1;
                }

                if( packetCounter != (int) recBuff[m*48 + 10] )
                {
                    printf("PacketCounter does not match with with current packet count (StreamData).\n");
                    return -1;
                }

                backLog = recBuff[m*48 + 45]&0x7F;

                //Checking MSB for Comm buffer overflow
                if( (recBuff[m*48 + 45] & 128) == 128 )
                {
                    printf("\nComm buffer overflow detected in packet %d\n", totalPackets);
                    printf("Current Comm backlog: %d\n", recBuff[m*48 + 45]&0x7F);
                    overflow = 1;
                }

                for( k = 12; k < 43; k += 2 )
                {
                    voltageBytes = (uint16)recBuff[m*48 + k] + (uint16)recBuff[m*48 + k+1]*256;
                    getAinVoltCalibrated(caliInfo, (uint8)(0x00), AIN_RESOLUTION, voltageBytes, &(voltages[scanNumber][currChannel]));
                    currChannel++;
                    if( currChannel >= NUM_CHANNELS )
                    {
                        currChannel = 0;
                        scanNumber++;
                    }
                }

                if( packetCounter >= 255 )
                    packetCounter = 0;
                else
                    packetCounter++;

                //Handle Comm buffer overflow by stopping, flushing and restarting stream
                if( overflow == 1 )
                {
                    printf("\nRestarting stream...\n");
                    doFlush(hDevice);
                    if( StreamConfig_example(hDevice) != 0 )
                    {
                        printf("Error restarting StreamConfig.\n");
                        return -1;
                    }

                    if( StreamStart(hDevice) != 0 )
                    {
                        printf("Error restarting StreamStart.\n");
                        return -1;
                    }
                    packetCounter = 0;
                    break;
                }
            }
        }

        printf("\nNumber of scans: %d\n", scanNumber);
        printf("Total packets read: %d\n", totalPackets);
        printf("Current PacketCounter: %d\n", ((packetCounter == 0) ? 255 : packetCounter-1));
        printf("Current Comm backlog: %d\n", backLog);

        for( k = 0; k < NUM_CHANNELS; k++ )
            printf("  AIN%d: %.4f V\n", k, voltages[scanNumber - 1][k]);
    }

    endTime = getTickCount();
    printf("\nRate of samples: %.0lf samples per second\n", (scanNumber*NUM_CHANNELS)/((endTime - startTime)/1000.0));
    printf("Rate of scans: %.0lf scans per second\n\n", scanNumber/((endTime - startTime)/1000.0));

    return 0;
}

//Sends a StreamStop low-level command to stop streaming.
int StreamStop(HANDLE hDevice)
{
    uint8 sendBuff[2], recBuff[4];
    int sendChars, recChars;

    sendBuff[0] = (uint8)(0xB0);  //CheckSum8
    sendBuff[1] = (uint8)(0xB0);  //Command byte

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 2);
    if( sendChars < 2 )
    {
        if( sendChars == 0 )
            printf("Error : write failed (StreamStop).\n");
        else
            printf("Error : did not write all of the buffer (StreamStop).\n");
        return -1;
    }

    //Reading response from UE9
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

    if( recBuff[1] != (uint8)(0xB1) )
    {
        printf("Error : read buffer has wrong command byte (StreamStop).\n");
        return -1;
    }

    if( recBuff[2] != 0 )
    {
        printf("Errorcode # %d from StreamStop read.\n", (unsigned int)recBuff[2]);
        return -1;
    }

    return 0;
}

//Sends a FlushBuffer low-level command to clear the stream buffer.
int flushStream(HANDLE hDevice)
{
    uint8 sendBuff[2], recBuff[2];
    int sendChars, recChars;

    sendBuff[0] = (uint8)(0x08);  //CheckSum8
    sendBuff[1] = (uint8)(0x08);  //Command byte

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 2);
    if( sendChars < 2 )
    {
        if( sendChars == 0 )
            printf("Error : write failed (flushStream).\n");
        else
            printf("Error : did not write all of the buffer (flushStream).\n");
        return -1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 2);
    if( recChars < 2 )
    {
        if( recChars == 0 )
            printf("Error : read failed (flushStream).\n");
        else
            printf("Error : did not read all of the buffer (flushStream).\n");
        return -1;
    }

    if( recBuff[0] != (uint8)(0x08) || recBuff[1] != (uint8)(0x08) )
    {
        printf("Error : read buffer has wrong command byte (flushStream).\n");
        return -1;
    }

    return 0;
}

//Runs StreamStop and flushStream low-level functions to flush out the
//streaming buffer.  Also reads 128 bytes from streaming endpoint to clear any
//left over data.  If there is nothing to read from the streaming endpoint,
//then there will be a timeout delay.  This function is useful for stopping
//streaming and clearing it after a Comm buffer overflow.
int doFlush(HANDLE hDevice)
{
    uint8 recBuff[192];

    printf("Flushing stream and reading left over data.\n");
    StreamStop(hDevice);
    flushStream(hDevice);
    LJUSB_Stream(hDevice, recBuff, 192);

    return 0;
}
