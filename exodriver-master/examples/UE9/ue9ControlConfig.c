//Author: LabJack
//May 25, 2011
//This example program sends a ControlConfig low-level command, and reads the 
//various parameters associated with the Control processor.

#include "ue9.h"


int controlConfig_example(HANDLE hDevice, ue9CalibrationInfo *caliInfo);

int main(int argc, char **argv)
{
    HANDLE hDevice;
    ue9CalibrationInfo caliInfo;

    //Opening first found UE9 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        goto done;

    //Getting calibration information from UE9
    if(getCalibrationInfo(hDevice, &caliInfo) < 0)
        goto close;

    controlConfig_example(hDevice, &caliInfo);

close:
    closeUSBConnection(hDevice);
done:
    return 0;
}

//Sends a ControlConfig low-level command to read the configuration settings 
//associated with the Control chip.
int controlConfig_example(HANDLE hDevice, ue9CalibrationInfo *caliInfo)
{
    uint8 sendBuff[18], recBuff[24];
    uint16 checksumTotal;
    int sendChars, recChars, i;
    double dac;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x06);  //Number of data words
    sendBuff[3] = (uint8)(0x08);  //Extended command number

    //WriteMask, PowerLevel, FIODir, etc. are all passed a value of zero since
    //we only want to read Control configuration settings, not change them.
    for( i = 6; i < 18; i++ )
        sendBuff[i] = (uint8)(0x00);

    extendedChecksum(sendBuff,18);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 18);
    if( sendChars < 18 )
    {
        if( sendChars == 0 )
            printf("Error : write failed\n");
        else
            printf("Error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 24);
    if( recChars < 24 )
    {
        if( recChars == 0 )
            printf("Error : read failed\n");
        else
            printf("Error : did not read all of the buffer\n");
        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 24);
    if( (uint8)((checksumTotal >> 8) & 0xff) != recBuff[5] )
    {
        printf("Error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xff) != recBuff[4] )
    {
        printf("Error : read buffer has bad checksum16(LSB)\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("Error : read buffer has bad checksum8\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != (uint8)(0x09) || recBuff[3] != (uint8)(0x08) )
    {
        printf("Error : read buffer has wrong command bytes \n");
        return -1;
    }

    if( recBuff[6] != 0 )
    {
        printf("Errorcode (byte 6): %d\n", (unsigned int)recBuff[6]);
        return -1;
    }

    printf("PowerLevel default (byte 7): %d\n", (unsigned int)recBuff[7]);  
    printf("ResetSource (byte 8): %d\n", (unsigned int)recBuff[8]); 
    printf("ControlFW Version (bytes 9 and 10): %.3f\n", (unsigned int)recBuff[10] + (double)recBuff[9]/100.0); 
    printf("ControlBL Version (bytes 11 and 12): %.3f\n", (unsigned int)recBuff[12] + (double)recBuff[11]/100.0);  
    printf("FIO default directions and states (bytes 14 and 15):\n");

    for( i = 0; i < 8; i++ )
        printf("  FIO%d: %d and %d\n", i,( (unsigned int)recBuff[14] << (31 - i) ) >> 31, ( (unsigned int)recBuff[15] << (31 - i) ) >> 31);

    printf("EIO default directions and states (bytes 16 and 17):\n");

    for( i = 0; i < 8; i++ )
        printf("  EIO%d: %d and %d\n", i, ( (unsigned int)recBuff[16] << (31 - i) ) >> 31, ( (unsigned int)recBuff[17] << (31 - i) ) >> 31);

    printf("CIO default directions and states (byte 18):\n");

    for( i = 0; i <= 3; i++ )
        printf("  CIO%d: %d and %d\n", i, ( (unsigned int)recBuff[18] << (27 - i) ) >> 31, ( (unsigned int)recBuff[18] << (31 - i) ) >> 31);

    printf("MIO default directions and states (byte 19):\n");

    for( i = 0; i <= 2; i++ )
        printf("  MIO%d: %d and %d\n", i, ( (unsigned int)recBuff[19] << (27 - i) ) >> 31, ( (unsigned int)recBuff[19] << (31 - i) ) >> 31);

    printf("DAC0 default (bytes 20 and 21):\n  Enabled: %d\n  Update: %d\n", ( (unsigned int)recBuff[21] << 24 ) >> 31, ( (unsigned int)recBuff[21] << 25 ) >> 31);

    //Getting DAC0 binary value
    dac = (double)( (unsigned int)recBuff[20] + (( (unsigned int)recBuff[21] << 28 ) >> 20) );

    //Getting DAC0 analog value ( Volts = (Bits - Offset)/Slope )
    dac = (dac - caliInfo->ccConstants[11])/caliInfo->ccConstants[10];
    printf("  Voltage: %.3f V\n", dac);

    printf("DAC1 default (bytes 22 and 23):\n  Enabled: %d\n  Update: %d\n", ( (unsigned int)recBuff[23] << 24 ) >> 31, ( (unsigned int)recBuff[23] << 25 ) >> 31);

    //getting DAC1 binary value
    dac = (double)( (unsigned int)recBuff[22] + (( (unsigned int)recBuff[23] << 28 ) >> 20) );

    //getting DAC1 analog value ( Volts = (Bits - Offset)/Slope )
    dac = (dac - caliInfo->ccConstants[13])/caliInfo->ccConstants[12];
    printf("  Voltage: %.3f V\n", dac);

    return 0;
}
