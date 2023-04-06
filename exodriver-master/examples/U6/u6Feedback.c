//Author : LabJack
//April 5, 2011
//This example does the following:
//  Sets DAC0 to 3.5 volts.
//  Reads AIN0-AIN1, and AIN0 differential voltage.
//  Sets FIO0 to digital input.
//  Sets FIO1 and FIO2 to Timers 0 and 1 with modes PMW8 and PMW16.
//  Sets and reads FIO3 as Counter 1
//  Reads the temperature.

#include <unistd.h>
#include <termios.h>
#include "u6.h"


static struct termios termNew, termOrig;
static int peek = -1;

int configIO_example(HANDLE hDevice, int enable);
int configTimerClock_example(HANDLE hDevice);
int feedback_setup_example(HANDLE hDevice, u6CalibrationInfo *caliInfo);
int feedback_loop_example(HANDLE hDevice, u6CalibrationInfo *caliInfo);

void setTerm();
int kbhit();
void unsetTerm();

int main(int argc, char **argv)
{
    HANDLE hDevice;
    u6CalibrationInfo caliInfo;

    //setting terminal settings
    setTerm();

    //Opening first found U6 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        goto done;

    //Getting calibration information from U6
    if( getCalibrationInfo(hDevice, &caliInfo) < 0 )
        goto close;

    if( configIO_example(hDevice, 1) != 0 )
        goto close;

    if( configTimerClock_example(hDevice) != 0 )
        goto close;


    if( feedback_setup_example(hDevice, &caliInfo) != 0 )
        goto close;

    if( feedback_loop_example(hDevice, &caliInfo) != 0 )
        goto close;

    configIO_example(hDevice, 0);

close:
    closeUSBConnection(hDevice);
done:
    printf("\nDone\n");

    //Setting terminal settings to previous settings
    unsetTerm();
    return 0;
}

//Sends a ConfigIO low-level command that configures the FIOs, DAC, Timers and
//Counters for this example
int configIO_example(HANDLE hDevice, int enable)
{
    uint8 sendBuff[16], recBuff[16];
    uint16 checksumTotal;
    int sendChars, recChars, i;
    uint8 numTimers, counterEnable;

    if( enable == 0 )
    {
        numTimers = 0;  //Setting NumberTimersEnabled byte to zero to turn off all Timers
        counterEnable = 0 + 0*2;  //Setting CounterEnable bits 0 and 1 to zero to disabled
                                  //Counters 0 and 1
    }
    else
    {
        numTimers = 2;  //Setting NumberTimersEnabled byte to 2 to indicate we are enabling
                        //2 timers (Timers 0 and 1)
        counterEnable = 0 + 1*2;  //Setting CounterEnable bit 1 to enable Counter 1
    }

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x05);  //Number of data words
    sendBuff[3] = (uint8)(0x0B);  //Extended command number

    sendBuff[6] = 1;  //Writemask : Setting writemask for timerCounterConfig (bit 0)

    sendBuff[7] = numTimers;      //NumberTimersEnabled
    sendBuff[8] = counterEnable;  //CounterEnable: Bit 0 is Counter 0, Bit 1 is Counter 1
    sendBuff[9] = 1;  //TimerCounterPinOffset:  Setting to 1 so Timer/Counters start on FIO1

    for( i = 10; i < 16; i++ )
        sendBuff[i] = 0;  //Reserved
    extendedChecksum(sendBuff, 16);

    //Sending command to U6
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 16)) < 16 )
    {
        if(sendChars == 0)
            printf("ConfigIO error : write failed\n");
        else
            printf("ConfigIO error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from U6
    if( (recChars = LJUSB_Read(hDevice, recBuff, 16)) < 16 )
    {
        if(recChars == 0)
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
        printf("ConfigIO error : read buffer has bad checksum16(LBS)\n");
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

    return 0;
}

//Sends a ConfigTimerClock low-level command that configures the timer clock
//for this example
int configTimerClock_example(HANDLE hDevice)
{
    uint8 sendBuff[10], recBuff[10];
    uint16 checksumTotal;
    int sendChars, recChars;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x02);  //Number of data words
    sendBuff[3] = (uint8)(0x0A);  //Extended command number

    sendBuff[6] = 0;  //Reserved
    sendBuff[7] = 0;  //Reserved

    sendBuff[8] = 6 + 1*128;  //TimerClockConfig : Configuring the clock (bit 7) and
                              //setting the TimerClockBase (bits 0-2) to
                              //48MHz/TimerClockDivisor
    sendBuff[9] = 2;  //TimerClockDivisor : Setting to 2, so the actual timer
                      //clock is 24 MHz
    extendedChecksum(sendBuff, 10);

    //Sending command to U6
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 10)) < 10 )
    {
        if(sendChars == 0)
            printf("ConfigTimerClock error : write failed\n");
        else
            printf("ConfigTimerClock error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from U6
    if( (recChars = LJUSB_Read(hDevice, recBuff, 10)) < 10 )
    {
        if( recChars == 0 )
            printf("ConfigTimerClock error : read failed\n");
        else
            printf("ConfigTimerClock error : did not read all of the buffer\n");
        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 10);
    if( (uint8)((checksumTotal / 256 ) & 0xff) != recBuff[5] )
    {
        printf("ConfigTimerClock error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xff) != recBuff[4] )
    {
        printf("ConfigTimerClock error : read buffer has bad checksum16(LBS)\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("ConfigTimerClock error : read buffer has bad checksum8\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != (uint8)(0x02) || recBuff[3] != (uint8)(0x0A) )
    {
        printf("ConfigTimerClock error : read buffer has wrong command bytes\n");
        return -1;
    }

    if( recBuff[6] != 0 )
    {
        printf("ConfigTimerClock error : read buffer received errorcode %d\n", recBuff[6]);
        return -1;
    }

    return 0;
}


//Sends a Feedback low-level command that configures digital directions,
//states, timer modes and DAC0 for this example.
int feedback_setup_example(HANDLE hDevice, u6CalibrationInfo *caliInfo)
{
    uint8 sendBuff[28], recBuff[18];
    int sendChars, recChars;
    uint16 binVoltage16, checksumTotal;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = 11;             //Number of data words (.5 word for echo, 10.5
                                  //words for IOTypes and data)
    sendBuff[3] = (uint8)(0x00);  //Extended command number

    sendBuff[6] = 0;     //Echo

    sendBuff[7] = 13;    //IOType is BitDirWrite
    sendBuff[8] = 0 + 128*0;  //IONumber (bits 0 - 4) is 0 (FIO0) and Direction (bit 7) is
                              //input

    sendBuff[9] = 43;  //IOType is Timer0Config
    sendBuff[10] = 0;  //TimerMode is 16 bit PWM output (mode 0)
    sendBuff[11] = 0;  //Value LSB
    sendBuff[12] = 0;  //Value MSB, Whole value is 32768

    sendBuff[13] = 42;   //IOType is Timer0
    sendBuff[14] = 1;    //UpdateReset
    sendBuff[15] = 0;    //Value LSB
    sendBuff[16] = 128;  //Value MSB, Whole Value is 32768

    sendBuff[17] = 45;  //IOType is Timer1Config
    sendBuff[18] = 1;   //TimerMode is 8 bit PWM output (mode 1)
    sendBuff[19] = 0;   //Value LSB
    sendBuff[20] = 0;   //Value MSB, Whole value is 32768

    sendBuff[21] = 44;   //IOType is Timer1
    sendBuff[22] = 1;    //UpdateReset
    sendBuff[23] = 0;    //Value LSB
    sendBuff[24] = 128;  //Value MSB, Whole Value is 32768

    sendBuff[25] = 38;  //IOType is DAC0 (16-bit)

    //Value is 3.5 volts (in binary form)
    getDacBinVoltCalibrated16Bit(caliInfo, 0, 3.5, &binVoltage16);

    sendBuff[26] = (uint8)(binVoltage16&255);          //Value LSB
    sendBuff[27] = (uint8)((binVoltage16&65280)/256);  //Value MSB

    extendedChecksum(sendBuff, 28);

    //Sending command to U6
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 28)) < 28 )
    {
        if( sendChars == 0 )
            printf("Feedback setup error : write failed\n");
        else
            printf("Feedback setup error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from U6
    if( (recChars = LJUSB_Read(hDevice, recBuff, 18)) < 18 )
    {
        if( recChars == 0 )
        {
            printf("Feedback setup error : read failed\n");
            return -1;
        }
        else
            printf("Feedback setup error : did not read all of the buffer\n");
    }

    checksumTotal = extendedChecksum16(recBuff, 18);
    if( (uint8)((checksumTotal / 256 ) & 0xff) != recBuff[5] )
    {
        printf("Feedback setup error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xff) != recBuff[4] )
    {
        printf("Feedback setup error : read buffer has bad checksum16(LBS)\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("Feedback setup error : read buffer has bad checksum8\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != 6 || recBuff[3] != (uint8)(0x00) )
    {
        printf("Feedback setup error : read buffer has wrong command bytes \n");
        return -1;
    }

    if( recBuff[6] != 0 )
    {
        printf("Feedback setup error : received errorcode %d for frame %d in Feedback response. \n", recBuff[6], recBuff[7]);
        return -1;
    }

    return 0;
}


//Calls a Feedback low-level call to read AIN0, AIN1, AIN2, AIN0 differential,
//FIO0, Counter1(FIO3) and temperature.
int feedback_loop_example(HANDLE hDevice, u6CalibrationInfo *caliInfo)
{
    long count;
    uint8 sendBuff[28], recBuff[26];
    int sendChars, recChars;
    uint16 checksumTotal;
    double voltage, temperature;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = 11;             //Number of data words (.5 word for echo, 10.5
                                  //words for IOTypes)
    sendBuff[3] = (uint8)(0x00);  //Extended command number

    sendBuff[6] = 0;  //Echo

    sendBuff[7] = 2;         //IOType is AIN24
    sendBuff[8] = 0;         //Positive channel
    sendBuff[9] = 8 + 0*16;  //ResolutionIndex(Bits 0-3) = 8,
                             //GainIndex(Bits 4-7) = 0 (+-10V)
                            
    sendBuff[10] =  0 + 0*128;  //SettlingFactor(Bits 0-2) = 0 (5 microseconds),
                                // Differential(Bit 7) = 0

    sendBuff[11] = 2;           //IOType is AIN24
    sendBuff[12] = 1;           //Positive channel
    sendBuff[13] = 8 + 0*16;    //ResolutionIndex(Bits 0-3) = 8,
                                //GainIndex(Bits 4-7) = 0 (+-10V)
    sendBuff[14] =  0 + 0*128;  //SettlingFactor(Bits 0-2) = 0 (5 microseconds),
                                //Differential(Bit 7) = 0

    sendBuff[15] = 2;          //IOType is AIN24
    sendBuff[16] = 0;          //Positive channel
    sendBuff[17] = 8 + 0*16;   //ResolutionIndex(Bits 0-3) = 8,
                               //GainIndex(Bits 4-7) = 0 (+-10V)
    sendBuff[18] = 0 + 1*128;  //SettlingFactor(Bits 0-2) = 0 (5 microseconds),
                               //Differential(Bit 7) = 1

    sendBuff[19] = 10;  //IOType is BitStateRead
    sendBuff[20] = 0;   //IO number is 0 (FIO0)

    sendBuff[21] = 55;  //IOType is Counter1
    sendBuff[22] = 0;   //Reset (bit 0) is not set

    sendBuff[23] = 2;          //IOType is AIN24
    sendBuff[24] = 14;         //Positive channel = 14 (temperature sensor)
    sendBuff[25] = 8 + 0*16;   //ResolutionIndex(Bits 0-3) = 8,
                               //GainIndex(Bits 4-7) = 0 (+-10V)
    sendBuff[26] = 0 + 0*128;  //SettlingFactor(Bits 0-2) = 0 (5 microseconds), Differential(Bit 7) = 0

    sendBuff[27] = 0;    //Padding byte

    extendedChecksum(sendBuff, 28);

    printf("Running Feedback calls in a loop\n");

    count = 0;
    while( !kbhit() )
    {
        count++;
        printf("Iteration %ld\n", count);

        //Sending command to U6
        if( (sendChars = LJUSB_Write(hDevice, sendBuff, 28)) < 28 )
        {
            if(sendChars == 0)
                printf("Feedback loop error : write failed\n");
            else
                printf("Feedback loop error : did not write all of the buffer\n");
            return -1;
        }

        //Reading response from U6
        if( (recChars = LJUSB_Read(hDevice, recBuff, 26)) < 26 )
        {
            if( recChars == 0 )
            {
                printf("Feedback loop error : read failed\n");
                return -1;
            }
            else
                printf("Feedback loop error : did not read all of the expected buffer\n");
        }

        if( recChars < 10 )
        {
            printf("Feedback loop error : response is not large enough\n");
            return -1;
        }

        checksumTotal = extendedChecksum16(recBuff, recChars);
        if( (uint8)((checksumTotal / 256 ) & 0xff) != recBuff[5] )
        {
            printf("Feedback loop error : read buffer has bad checksum16(MSB)\n");
            return -1;
        }

        if( (uint8)(checksumTotal & 0xff) != recBuff[4] )
        {
            printf("Feedback loop error : read buffer has bad checksum16(LBS)\n");
            return -1;
        }

        if( extendedChecksum8(recBuff) != recBuff[0] )
        {
            printf("Feedback loop error : read buffer has bad checksum8\n");
            return -1;
        }

        if( recBuff[1] != (uint8)(0xF8) ||  recBuff[3] != (uint8)(0x00) )
        {
            printf("Feedback loop error : read buffer has wrong command bytes \n");
            return -1;
        }

        if( recBuff[6] != 0 )
        {
            printf("Feedback loop error : received errorcode %d for frame %d ", recBuff[6], recBuff[7]);
            switch( recBuff[7] )
            {
                case 1: printf("(AIN0(SE))\n"); break;
                case 2: printf("(AIN1(SE))\n"); break;
                case 3: printf("(AIN0(Diff))\n"); break;
                case 4: printf("(BitStateRead for FIO7)\n"); break;
                case 5: printf("(Counter1)\n"); break;
                case 6: printf("(Temp. Sensor\n"); break;
                default: printf("(Unknown)\n"); break;
            }
            return -1;
        }

        getAinVoltCalibrated(caliInfo, 8, 0, 1, recBuff[9] + recBuff[10]*256 + recBuff[11]*65536, &voltage);
        printf("AIN0(SE) : %.3f volts\n", voltage);

        getAinVoltCalibrated(caliInfo, 8, 0, 1, recBuff[12] + recBuff[13]*256 + recBuff[14]*65536, &voltage);
        printf("AIN1(SE) : %.3f volts\n", voltage);

        getAinVoltCalibrated(caliInfo, 8, 0, 1, recBuff[15] + recBuff[16]*256 + recBuff[17]*65536, &voltage);
        printf("AIN0(Diff) : %.3f volts\n", voltage);

        printf("FIO0 state : %d\n", recBuff[18]);

        printf("Counter1(FIO3) : %u\n\n", recBuff[19] + recBuff[20]*256 + recBuff[21]*65536 + recBuff[22]*16777216);

        getTempKCalibrated(caliInfo, 8, 0, 1, recBuff[23] + recBuff[24]*256 + recBuff[25]*65536, &temperature);
        printf("Temperature : %.3f K\n\n", temperature);
        sleep(1);
    }
    return 0;
}


void setTerm()
{
    tcgetattr(0, &termOrig);
    termNew = termOrig;
    termNew.c_lflag &= ~ICANON;
    termNew.c_lflag &= ~ECHO;
    termNew.c_lflag &= ~ISIG;
    termNew.c_cc[VMIN] = 1;
    termNew.c_cc[VTIME] = 0;
    tcsetattr(0, TCSANOW, &termNew);
}

int kbhit()
{
    char ch;
    int nread;

    if( peek != -1 )
        return 1;

    termNew.c_cc[VMIN]=0;
    tcsetattr(0, TCSANOW, &termNew);
    nread = read(0,&ch,1);
    termNew.c_cc[VMIN]=1;
    tcsetattr(0, TCSANOW, &termNew);

    if( nread == 1 )
    {
        peek = ch;
        return 1;
    }

    return 0;
}

void unsetTerm()
{
    tcsetattr(0, TCSANOW, &termOrig);
}
