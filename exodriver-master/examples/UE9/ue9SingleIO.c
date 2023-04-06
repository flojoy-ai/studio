//Author: LabJack
//May 25, 2011
//This example program makes 3 SingleIO low-level function calls.  One call sets
//DAC0 to 2.500 V.  One call reads voltage from AIN0.  One call reads the 
//temperature from the internal temperature sensor.  Control firmware version 
//1.03 and above needed for SingleIO.
#include "ue9.h"


int singleIO_AV_example(HANDLE handle, ue9CalibrationInfo *caliInfo);

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

    singleIO_AV_example(hDevice, &caliInfo);

close:
    closeUSBConnection(hDevice);
done:
    return 0;
}

//Sends 3 SingleIO low-level commands to set DAC0, read AIN0 and read the 
//temperature
int singleIO_AV_example(HANDLE hDevice, ue9CalibrationInfo *caliInfo)
{
    uint8 sendBuff[8], recBuff[8], ainResolution;
    uint16 bytesVoltage, bytesTemperature;
    int sendChars, recChars;
    double voltage;
    double temperature;  //in Kelvins
    
    ainResolution = 12;
    //ainResolution = 18;  //high-res mode for UE9 Pro only

    /* Setting voltage of DAC0 to 2.500 V */
    //if( getDacBinVoltUncalibrated(0, 2.500, &bytesVoltage) < 0 )
    if( getDacBinVoltCalibrated(caliInfo, 0, 2.500, &bytesVoltage) < 0 )
        return -1;

    sendBuff[1] = (uint8)(0xA3);  //Command byte
    sendBuff[2] = (uint8)(0x05);  //IOType = 5 (analog out)
    sendBuff[3] = (uint8)(0x00);  //Channel = 0 (DAC0)
    sendBuff[4] = (uint8)( bytesVoltage & (0x00FF) );  //low bits of voltage
    sendBuff[5] = (uint8)( bytesVoltage /256 ) + 192;  //high bits of voltage 
                                                       //(bit 7 : Enable, 
                                                       // bit 6: Update)
    sendBuff[6] = (uint8)(0x00);  //Settling time - does not apply to analog output
    sendBuff[7] = (uint8)(0x00);  //Reserved
    sendBuff[0] = normalChecksum8(sendBuff, 8);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 8);
    if( sendChars < 8 )
    {
        if( sendChars == 0 )
            goto sendError0;
        else
            goto sendError1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 8);
    if( recChars < 8 )
    {
        if( recChars == 0 )
            goto recvError0;
        else
            goto recvError1;
    }

    if( (uint8)(normalChecksum8(recBuff, 8)) != recBuff[0] )
        goto chksumError;

    if( recBuff[1] != (uint8)(0xA3) )
        goto commandByteError;

    if( recBuff[2] != (uint8)(0x05) )
        goto IOTypeError;

    if( recBuff[3] != 0 )
        goto channelError;

    printf("Set DAC0 voltage to 2.500 V ...\n");

    /* Reading voltage from AIN0 */
    sendBuff[1] = (uint8)(0xA3);  //Command byte
    sendBuff[2] = (uint8)(0x04);  //IOType = 4 (analog in)
    sendBuff[3] = (uint8)(0x00);  //Channel = 0 (AIN0)
    sendBuff[4] = (uint8)(0x00);  //BipGain (Bip = unipolar, Gain = 1)
    sendBuff[5] = ainResolution;  //Resolution
    sendBuff[6] = (uint8)(0x00);  //SettlingTime = 0
    sendBuff[7] = (uint8)(0x00);  //Reserved
    sendBuff[0] = normalChecksum8(sendBuff, 8);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 8);
    if( sendChars < 8 )
    {
        if( sendChars == 0 )
            goto sendError0;
        else
            goto sendError1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 8);
    if( recChars < 8 )
    {
        if( recChars == 0 )
            goto recvError0;
        else
            goto recvError1;
    }

    if( (uint8)(normalChecksum8(recBuff, 8)) != recBuff[0] )
        goto chksumError;

    if( recBuff[1] != (uint8)(0xA3) )
        goto commandByteError;

    if( recBuff[2] != (uint8)(0x04) )
        goto IOTypeError;

    if( recBuff[3] != 0 )
        goto channelError;

    bytesVoltage = recBuff[5] + recBuff[6]*256;

    //if( getAinVoltUncalibrated(sendBuff[4], ainResolution, bytesVoltage, &voltage) < 0 )
    if( getAinVoltCalibrated(caliInfo, sendBuff[4], ainResolution, bytesVoltage, &voltage) < 0 )
        return -1;

    printf("Voltage read from AI0: %.4f V\n", voltage);

    /* Reading temperature from internal temperature sensor */
    sendBuff[1] = (uint8)(0xA3);  //Command byte
    sendBuff[2] = (uint8)(0x04);  //IOType = 4 (analog in)
    sendBuff[3] = (uint8)(0x85);  //Channel = 133 (tempSensor)
    sendBuff[4] = (uint8)(0x00);  //Gain = 1 (Bip does not apply)
    sendBuff[5] = (uint8)(0x0C);  //Resolution = 12
    sendBuff[6] = (uint8)(0x00);  //SettlingTime = 0
    sendBuff[7] = (uint8)(0x00);  //Reserved
    sendBuff[0] = normalChecksum8(sendBuff, 8);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 8);
    if( sendChars < 8 )
    {
        if( sendChars == 0 )
            goto sendError0;
        else  
            goto sendError1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 8);
    if( recChars < 8 )
    {
        if( recChars == 0 )
            goto recvError0;
        else
            goto recvError1;
    }

    if( (uint8)(normalChecksum8(recBuff, 8)) != recBuff[0] )
        goto chksumError;

    if( recBuff[1] != (uint8)(0xA3) )
        goto commandByteError;

    if( recBuff[2] != (uint8)(0x04) )
        goto IOTypeError;

    if( recBuff[3] != (uint8)(0x85) )
        goto channelError;

    bytesTemperature = recBuff[5] + recBuff[6]*256;

    //Assuming high power level
    //if( getTempKUncalibrated(0, bytesTemperature, &temperature) < 0 )
    if( getTempKCalibrated(caliInfo, 0, bytesTemperature, &temperature) < 0 )
        return -1;

    printf("Temperature read internal temperature sensor (channel 133): %.1f K\n\n", temperature);
        return 0;

    //error printouts
sendError0:
    printf("Error : write failed\n");
    return -1;
sendError1:
    printf("Error : did not write all of the buffer\n");
    return -1;
recvError0:
    printf("Error : read failed\n");
    return -1;
recvError1:  
    printf("Error : did not read all of the buffer\n");
    return -1;
chksumError:
    printf("Error : read buffer has bad checksum\n");
    return -1;
commandByteError:
    printf("Error : read buffer has wrong command byte\n");
    return -1;
IOTypeError:  
    printf("Error : read buffer has wrong IOType\n");
    return -1;
channelError:  
    printf("Error : read buffer has wrong channel\n");
    return -1;
}
