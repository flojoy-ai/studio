//Author: LabJack
//May 25, 2011
//This example program calls the TimerCounter function, and reads both counters
//and enables 2 timers with PWM output.  Connect FIO0/FIO1 to FIO2/FIO3 to have 
//the counter read something.  After 1 second the counters' counts are outputted 
//to the screen.

#include <unistd.h>
#include "ue9.h"


int timerCounter_example(HANDLE hDevice);
int errorCheck(uint8 *buffer);

int main(int argc, char **argv)
{
    HANDLE hDevice;

    //Opening first found UE9 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        return 1;

    timerCounter_example(hDevice);
    closeUSBConnection(hDevice);
    return 0;
}

//Sends a TimerCounter low-level command to enable and set two Timers 
//(FIO0, FIO1) and two Counters (FIO2, FIO3), then sends a TimerCounter 
//command a second later to read from the Counters and last sends a 
//TimerCounter command to disable the Timers and Counters. 
int timerCounter_example(HANDLE hDevice)
{
    //Note: If using the quadrature input timer mode, the returned 32 bit
    //      integer is signed
    uint8 sendBuff[30], recBuff[40];
    uint32 cnt;
    int sendChars, recChars, i;

    //Enable timers and counters
    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x0C);  //Number of data words
    sendBuff[3] = (uint8)(0x18);  //Extended command number
    sendBuff[6] = (uint8)(0x03);  //TimerClockDivisor = 3
    sendBuff[7] = (uint8)(0x9A);  //Updating: 2 Timers enabled, Counter0 and 
                                  //Counter1 enabled
    sendBuff[8] = (uint8)(0x00);  //TimerClockConfig = 750 kHz (if using system 
                                  //clock, call ControlConfig first and set the 
                                  //PowerLevel to a fixed state)
    sendBuff[9] = (uint8)(0x00);  //UpdateReset - not resetting anything
    sendBuff[10] = (uint8)(0x00);  //Timer0Mode = 16-Bit PWM

    //Timer0Value = 32768
    sendBuff[11] = (uint8)(0x00);  //Timer0Value (low byte)
    sendBuff[12] = (uint8)(0x80);  //Timer0Value (high byte)

    //Timer1Value = 32768
    sendBuff[13] = (uint8)(0x01);  //Timer1Mode = 8-Bit PWM
    sendBuff[14] = (uint8)(0x00);  //Timer1Value (low byte)
    sendBuff[15] = (uint8)(0x80);  //Timer1Value (high byte)

    //timer modes and values for timers 2 - 5, which are not enabled
    for( i = 16; i < 28; i++ )
        sendBuff[i] = (uint8)(0x00);

    sendBuff[28] = (uint8)(0x00);  //Counter0Mode (pass 0)
    sendBuff[29] = (uint8)(0x00);  //Counter1Mode (pass 0) 

    extendedChecksum(sendBuff, 30);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 30);
    if( sendChars < 30 )
    {
        if( sendChars == 0 )
            goto writeError0;
        else
            goto writeError1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 40);
    if( recChars < 40 )
    {
        if( recChars == 0 )
            goto readError0;
        else
            goto readError1;
    }

    if( errorCheck(recBuff) == -1 )
        return -1;

    //Wait 1 sec and read counters
    sleep(1);

    sendBuff[1] = (uint8)(0xF8);  //Command bytes
    sendBuff[2] = (uint8)(0x0C);  //Number of data words  
    sendBuff[3] = (uint8)(0x18);  //Extended command number    

    //Not updating our configuration.  We only want to read the counter values.
    for( i = 6; i < 30; i++ )
        sendBuff[i] = (uint8)(0x00);

    extendedChecksum(sendBuff, 30);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 30);
    if( sendChars < 30 )
    {
        if( sendChars == 0 )
            goto writeError0;
        else
            goto writeError1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 40);
    if( recChars < 40 )
    {
        if( recChars == 0 )
            goto readError0;
        else  
            goto readError1;
    }

    if( errorCheck(recBuff) == -1 )
        return -1;

    printf("Current counts from counters after 1 second:\n");
    for( i = 0; i < 2; i++ )
    {
        cnt = (unsigned int)recBuff[32 + 4*i] + (unsigned int)recBuff[33 + 4*i]*256 + 
              (unsigned int)recBuff[34 + 4*i]*65536 + (unsigned int)recBuff[35 + 4*i]*16777216;
        printf("  Counter%d : %u\n", i, cnt);
    }

    //Disable timers and counters
    sendBuff[1] = (uint8)(0xF8);  //Command bytes
    sendBuff[2] = (uint8)(0x0C);  //Number of data words
    sendBuff[3] = (uint8)(0x18);  //Extended command number
    sendBuff[6] = (uint8)(0x00);  //TimerClockDivisor = 0
    sendBuff[7] = (uint8)(0x80);  //Updating: 0 Timers enabled, Counter0 and 
                                  //Counter1 disabled 

    //Setting bytes 8 - 30 to zero since nothing is enabled
    for( i = 8; i < 30; i++ )
        sendBuff[i] = (uint8)(0x00);

    extendedChecksum(sendBuff, 30);

    //Sending command to UE9
    sendChars = LJUSB_Write(hDevice, sendBuff, 30);
    if( sendChars < 30 )
    {
        if( sendChars == 0 )
            goto writeError0;
        else
            goto writeError1;
    }

    //Reading response from UE9
    recChars = LJUSB_Read(hDevice, recBuff, 40);
    if( recChars < 40 )
    {
        if( recChars == 0 )
            goto readError0;
        else
            goto readError1;
    }

    if( errorCheck(recBuff) == -1 )
        return -1;

    return 0;

writeError0: 
    printf("Error : write failed\n");
    return -1;

writeError1:
    printf("Error : did not write all of the buffer\n");
    return -1;

readError0:
    printf("Error : read failed\n");
    return -1;

readError1:
    printf("Error : did not read all of the buffer\n");
    return -1;
}

int errorCheck(uint8 *buffer)
{
    uint16 checksumTotal;

    checksumTotal = extendedChecksum16(buffer, 40);
    if( (uint8)((checksumTotal / 256) & 0xFF) != buffer[5] )
    {
        printf("Error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xFF) != buffer[4] )
    {
        printf("Error : read buffer has bad checksum16(LSB)\n");
        return -1;
    }

    if( extendedChecksum8(buffer) != buffer[0] )
    {
        printf("Error : read buffer has bad checksum8\n");
        return -1;
    }

    if( buffer[1] != (uint8)(0xF8) || buffer[2] != (uint8)(0x11) || buffer[3] != (uint8)(0x18) )
    {
        printf("Error : read buffer has wrong command bytes \n");
        return -1;
    }

    if( buffer[6] != 0 )
    {
        printf("Errorcode (byte 6): %d\n", (unsigned int)buffer[6]);
        return -1;
    }

    return 0;
}
