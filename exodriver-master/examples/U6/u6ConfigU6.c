//Author : LabJack
//April 6, 2011
//This example calls the ConfigU6 low-level function and reads back
//configuration settings.

#include "u6.h"


int configU6_example(HANDLE hDevice);

int main(int argc, char **argv)
{
    HANDLE hDevice;

    //Opening first found U6 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        return 1;

    configU6_example(hDevice);

    closeUSBConnection(hDevice);

    return 0;
}

//Sends a ConfigU3 low-level command to read back configuration settings
int configU6_example(HANDLE hDevice)
{
    uint8 sendBuff[26];
    uint8 recBuff[38];
    uint16 checksumTotal;
    int sendChars, recChars, i;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x0A);  //Number of data words
    sendBuff[3] = (uint8)(0x08);  //Extended command number

    //Setting all bytes to zero since we only want to read back the U6
    //configuration settings
    for( i = 6; i < 26; i++ )
        sendBuff[i] = 0;

    /* The commented out code below sets the U6's local ID to 3.  After setting
        the local ID, reset the device for this change to take effect. */

    //sendBuff[6] = 8;  //WriteMask : setting bit 3
    //sendBuff[8] = 3;  //LocalID : setting local ID to 3

    extendedChecksum(sendBuff, 26);

    //Sending command to U6
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 26)) < 26 )
    {
        if( sendChars == 0 )
            printf("ConfigU6 error : write failed\n");
        else
            printf("ConfigU6 error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from U6
    if( (recChars = LJUSB_Read(hDevice, recBuff, 38)) < 38 )
    {
        if( recChars == 0 )
            printf("ConfigU6 error : read failed\n");
        else
            printf("ConfigU6 error : did not read all of the buffer\n");
        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 38);
    if( (uint8)((checksumTotal / 256) & 0xff) != recBuff[5] )
    {
        printf("ConfigU6 error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xff) != recBuff[4] )
    {
        printf("ConfigU6 error : read buffer has bad checksum16(LBS)\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("ConfigU6 error : read buffer has bad checksum8\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != (uint8)(0x10) || recBuff[3] != (uint8)(0x08) )
    {
        printf("ConfigU6 error : read buffer has wrong command bytes\n");
        return -1;
    }

    if( recBuff[6] != 0 )
    {
        printf("ConfigU6 error : read buffer received errorcode %d\n", recBuff[6]);
        return -1;
    }

    printf("U6 Configuration Settings:\n");
    printf("FirmwareVersion: %.3f\n", recBuff[10] + recBuff[9]/100.0);
    printf("BootloaderVersion: %.3f\n", recBuff[12] + recBuff[11]/100.0);
    printf("HardwareVersion: %.3f\n", recBuff[14] + recBuff[13]/100.0);
    printf("SerialNumber: %u\n", recBuff[15] + recBuff[16]*256 + recBuff[17]*65536 + recBuff[18]*16777216);
    printf("ProductID: %d\n", recBuff[19] + recBuff[20]*256);
    printf("LocalID: %d\n", recBuff[21]);

    printf("Version Info: %d\n", recBuff[37]);
    printf("  U6 (bit 2): %d\n", ((recBuff[37]/4)&1));
    printf("  U6-Pro (bit 3): %d\n", ((recBuff[37]/8)&1));

    return 0;
}
