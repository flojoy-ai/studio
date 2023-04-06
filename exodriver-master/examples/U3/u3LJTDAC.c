//Author: LabJack
//December 27, 2011
//Communicates with an LJTick-DAC using low level functions.  The LJTDAC should
//be plugged into FIO4/FIO5 for this example.
//Tested with U3 firmware V1.44, and requires hardware version 1.21 or greater.

#include "u3.h"
#include <unistd.h>

int configIO_example(HANDLE hDevice);
int checkI2CErrorcode(uint8 errorcode);
int LJTDAC_example(HANDLE hDevice, u3TdacCalibrationInfo *caliInfo);

int main(int argc, char **argv)
{
    HANDLE hDevice;
    u3TdacCalibrationInfo caliInfo;

    //Opening first found U3 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        goto done;

    if( configIO_example(hDevice) != 0 )
        goto close;

    //Getting calibration information from LJTDAC
    if( getTdacCalibrationInfo(hDevice, &caliInfo, 4) < 0 )
        goto close;

    LJTDAC_example(hDevice, &caliInfo);

close:
    closeUSBConnection(hDevice);
done:
    return 0;
}


//Sends a ConfigIO low-level command that configures the FIO4 and FIO5 lines to
//digital.
int configIO_example(HANDLE hDevice)
{
    uint8 sendBuff[12], recBuff[12];
    uint16 checksumTotal;
    int sendChars, recChars;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x03);  //Number of data words
    sendBuff[3] = (uint8)(0x0B);  //Extended command number

    sendBuff[6] = 7;  //Writemask : Setting writemask for TimerCounterConfig (bit 0),
                      //            DAC1Enable (bit 1) and FIOAnalog (bit 2)

    sendBuff[7] = 0;  //Reserved
    sendBuff[8] = 64;  //TimerCounterConfig : disable timers and counters. set
                       //                     TimerCounterPinOffset to 4 (bits 4-7)
    sendBuff[9] = 0;  //DAC1 enable : disabling
    sendBuff[10] = 0;  //FIOAnalog : setting FIO channels to digital
    sendBuff[11] = 0;  //EIOAnalog : Not setting anything
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
    if( (uint8)((checksumTotal / 256 ) & 0xFF) != recBuff[5] )
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

    if( recBuff[8] != 64 )
    {
        printf("ConfigIO error : TimerCounterConfig did not get set correctly\n");
        return -1;
    }

    if( recBuff[10] != 0 && recBuff[10] != (uint8)(0x0F) )
    {
        printf("ConfigIO error : FIOAnalog did not set correctly\n");
        return -1;
    }

    return 0;
}


int checkI2CErrorcode(uint8 errorcode)
{
    if(errorcode != 0)
    {
        printf("I2C error : received errorcode %d in response\n", errorcode);
        return -1;
    }
    return 0;
}


int LJTDAC_example(HANDLE hDevice, u3TdacCalibrationInfo *caliInfo)
{
    uint8 options, speedAdjust, sdaPinNum, sclPinNum;
    uint8 address, numBytesToSend, numBytesToReceive, errorcode;
    uint8 bytesCommand[5], bytesResponse[64], ackArray[4];
    uint16 binaryVoltage;
    int err, i;

    err = 0;

    //Setting up parts I2C command that will remain the same throughout this
    //example
    options = 0;  //I2COptions : 0
    speedAdjust = 0;  //SpeedAdjust : 0 (for max communication speed of about
                      //130 kHz)
    sdaPinNum = 5;  //SDAPinNum : FIO5 connected to pin DIOB
    sclPinNum = 4;  //SCLPinNum : FIO4 connected to pin DIOA


    /* Set DACA to 1.2 volts. */

    //Setting up I2C command
    //Make note that the I2C command can only update 1 DAC channel at a time.
    address = (uint8)(0x24);  //Address : h0x24 is the address for DAC
    numBytesToSend = 3;  //NumI2CByteToSend : 3 bytes to specify DACA and the
                         //value
    numBytesToReceive = 0;  //NumI2CBytesToReceive : 0 since we are only setting
                            //the value of the DAC
    bytesCommand[0] = (uint8)(0x30);  //LJTDAC command byte : h0x30 (DACA)
    getTdacBinVoltCalibrated(caliInfo, 0, 1.2, &binaryVoltage);
    bytesCommand[1] = (uint8)(binaryVoltage/256);  //value (high)
    bytesCommand[2] = (uint8)(binaryVoltage & (0x00FF));  //value (low)

    //Performing I2C low-level call
    err = I2C(hDevice, options, speedAdjust, sdaPinNum, sclPinNum, address, numBytesToSend, numBytesToReceive, bytesCommand, &errorcode, ackArray, bytesResponse);

    if( checkI2CErrorcode(errorcode) == -1 || err == -1 )
        return -1;

    printf("DACA set to 1.2 volts\n\n");


    /* Set DACB to 2.3 volts. */

    //Setting up I2C command
    address = (uint8)(0x24);  //Address : h0x24 is the address for DAC
    numBytesToSend = 3;  //NumI2CByteToSend : 3 bytes to specify DACB and the
                         //value
    numBytesToReceive = 0;  //NumI2CBytesToReceive : 0 since we are only setting
                            //the value of the DAC
    bytesCommand[0] = (uint8)(0x31);  //LJTDAC command byte : h0x31 (DACB)
    getTdacBinVoltCalibrated(caliInfo, 1, 2.3, &binaryVoltage);
    bytesCommand[1] = (uint8)(binaryVoltage/256);  //value (high)
    bytesCommand[2] = (uint8)(binaryVoltage & (0x00FF));  //value (low)

    //Performing I2C low-level call
    err = I2C(hDevice, options, speedAdjust, sdaPinNum, sclPinNum, address, numBytesToSend, numBytesToReceive, bytesCommand, &errorcode, ackArray, bytesResponse);

    if( checkI2CErrorcode(errorcode) == -1 || err == -1 )
        return -1;

    printf("DACB set to 2.3 volts\n\n");


    /* More advanced operations. */

    /* Display LJTDAC calibration constants.  Code for getting the calibration 
     * constants is in the getLJTDACCalibrationInfo function in the u3.c file.
     */
    printf("DACA Slope = %.1f bits/volt\n", caliInfo->ccConstants[0]);
    printf("DACA Offset = %.1f bits\n", caliInfo->ccConstants[1]);
    printf("DACB Slope = %.1f bits/volt\n", caliInfo->ccConstants[2]);
    printf("DACB Offset = %.1f bits\n\n", caliInfo->ccConstants[3]);


    /* Read the serial number. */

    //Setting up I2C command
    address = (uint8)(0xA0);  //Address : h0xA0 is the address for EEPROM
    numBytesToSend = 1;  //NumI2CByteToSend : 1 byte for the EEPROM address
    numBytesToReceive = 4;  //NumI2CBytesToReceive : getting 4 bytes starting at
                            //EEPROM address specified in I2CByte0
    bytesCommand[0] = 96;  //I2CByte0 : Memory Address, starting at address 96
                           //(Serial Number)

    //Performing I2C low-level call
    err = I2C(hDevice, options, speedAdjust, sdaPinNum, sclPinNum, address, numBytesToSend, numBytesToReceive, bytesCommand, &errorcode, ackArray, bytesResponse);

    if( checkI2CErrorcode(errorcode) == -1 || err == -1 )
        return -1;

    printf("LJTDAC Serial Number = %u\n\n", (bytesResponse[0] + bytesResponse[1]*256 + bytesResponse[2]*65536 + bytesResponse[3]*16777216));


    /* User memory example.  We will read the memory, update a few elements, and
     * write the memory. The user memory is just stored as bytes, so almost any
     * information can be put in there such as integers, doubles, or strings.
     */

    /* Read the user memory : need to perform 2 I2C calls since command/response
       packets can only be 64 bytes in size */

    //Setting up 1st I2C command
    address = (uint8)(0xA0);  //Address : h0xA0 is the address for EEPROM
    numBytesToSend = 1;  //NumI2CByteToSend : 1 byte for the EEPROM address
    numBytesToReceive = 52;  //NumI2CBytesToReceive : getting 52 bytes starting
                             //at EEPROM address specified in I2CByte0
    bytesCommand[0] = 0;  //I2CByte0 : Memory Address, starting at address 0
                          //(User Area)

    //Performing I2C low-level call
    err = I2C(hDevice, options, speedAdjust, sdaPinNum, sclPinNum, address, numBytesToSend, numBytesToReceive, bytesCommand, &errorcode, ackArray, bytesResponse);

    if( checkI2CErrorcode(errorcode) == -1 || err == -1 )
        return -1;

    //Setting up 2nd I2C command
    numBytesToReceive = 12;  //NumI2CBytesToReceive : getting 12 bytes starting
                             //at EEPROM address specified in I2CByte0
    bytesCommand[0] = 52;  //I2CByte0 : Memory Address, starting at address 52
                           //(User Area)

    //Performing I2C low-level call
    err = I2C(hDevice, options, speedAdjust, sdaPinNum, sclPinNum, address, numBytesToSend, numBytesToReceive, bytesCommand, &errorcode, ackArray, bytesResponse + 52);

    if( checkI2CErrorcode(errorcode) == -1 || err == -1 )
        return -1;

    //Display the first 4 elements.
    printf("Read User Mem [0-3] = %d, %d, %d, %d\n", bytesResponse[0], bytesResponse[1], bytesResponse[2], bytesResponse[3]);


    /* Create 4 new pseudo-random numbers to write.  We will update the first
     * 4 elements of user memory, but the rest will be unchanged. */

    //Setting up I2C command
    address = (uint8)(0xA0);  //Address : h0xA0 is the address for EEPROM
    numBytesToSend = 5;  //NumI2CByteToSend : 1 byte for the EEPROM address and
                         //the rest for the bytes to write
    numBytesToReceive = 0;  //NumI2CBytesToReceive : 0 since we are only writing to memory
    bytesCommand[0] = 0;  //I2CByte0 : Memory Address, starting at address 0
                          //(User Area)
    srand((unsigned int)getTickCount());
    for(i = 1; i < 5; i++)
    {
        //I2CByte : byte in user memory
        bytesCommand[i] = (uint8)(255 * ((float)rand()/RAND_MAX));
    }

    printf("Write User Mem [0-3] = %d, %d, %d, %d\n", bytesCommand[1], bytesCommand[2], bytesCommand[3], bytesCommand[4]);

    //Performing I2C low-level call
    err = I2C(hDevice, options, speedAdjust, sdaPinNum, sclPinNum, address, numBytesToSend, numBytesToReceive, bytesCommand, &errorcode, ackArray, bytesResponse);

    if( checkI2CErrorcode(errorcode) == -1 || err == -1 )
        return -1;

    //Delay for 2 ms to allow the EEPROM to finish writing.
    //Re-read the user memory.
    usleep(2000);

    //Setting up 1st I2C command
    address = (uint8)(0xA0);  //Address : h0xA0 is the address for EEPROM
    numBytesToSend = 1;  //NumI2CByteToSend : 1 byte for the EEPROM address
    numBytesToReceive = 52;  //NumI2CBytesToReceive : getting 52 bytes starting
                             //at EEPROM address specified in I2CByte0
    bytesCommand[0] = 0;  //I2CByte0 : Memory Address, starting at address 0 
                          //(User Area)

    //Performing I2C low-level call
    err = I2C(hDevice, options, speedAdjust, sdaPinNum, sclPinNum, address, numBytesToSend, numBytesToReceive, bytesCommand, &errorcode, ackArray, bytesResponse);

    if( checkI2CErrorcode(errorcode) == -1 || err == -1 )
        return -1;

    //Setting up 2nd I2C command
    numBytesToReceive = 12;  //NumI2CBytesToReceive : getting 12 bytes starting
                             //at EEPROM address specified in I2CByte0
    bytesCommand[0] = 52;  //I2CByte0 : Memory Address, starting at address 52
                           //(User Area)

    //Performing I2C low-level call
    err = I2C(hDevice, options, speedAdjust, sdaPinNum, sclPinNum, address, numBytesToSend, numBytesToReceive, bytesCommand, &errorcode, ackArray, bytesResponse + 52);

    if( checkI2CErrorcode(errorcode) == -1 || err == -1 )
        return -1;

    //Display the first 4 elements.
    printf("Read User Mem [0-3] = %d, %d, %d, %d\n", bytesResponse[0], bytesResponse[1], bytesResponse[2], bytesResponse[3]);

    return err;
}
