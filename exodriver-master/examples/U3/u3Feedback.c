//Author : LabJack
//December 27, 2011
//For U3s with hardware versions 1.20, 1.21 and 1.30 LV, this example will
//set FIO0 and FIO1 to analog input, FIO2 to digital output set to low, and
//FIO3 to digital input.  FIO4 and FIO5 will be set as timers 0 and 1 with
//timer modes PMW8 and PMW16.  FIO6 will be set as counter 1.  Also, DAC0 will
//be set to 1.5 volts and the temperature will be read.
//For U3s with hardware version 1.30 HV, this example will read AIN0-AIN4 and
//set FIO7 to digital input.  FIO4 and FIO5 will be set as timers 0 and 1 with
//timer modes PMW8 and PMW16.  FIO6 will be set as counter 1.  Also, DAC0 will
//be set to 3.5 volts and the temperature will be read.

#include <unistd.h>
#include <termios.h>
#include "u3.h"


static struct termios termNew, termOrig;
static int peek = -1;

int configIO_example(HANDLE hDevice, int enable, int *isDAC1Enabled);
int configTimerClock_example(HANDLE hDevice);
int feedback_setup_example(HANDLE hDevice, u3CalibrationInfo *caliInfo);
int feedback_setup_HV_example(HANDLE hDevice, u3CalibrationInfo *caliInfo);
int feedback_loop_example(HANDLE hDevice, u3CalibrationInfo *caliInfo, int isDAC1Enabled);
int feedback_loop_HV_example(HANDLE hDevice, u3CalibrationInfo *caliInfo);

void setTerm();
int kbhit();
void unsetTerm();

int main(int argc, char **argv)
{
    HANDLE hDevice;
    u3CalibrationInfo caliInfo;
    int dac1Enabled;

    //setting terminal settings
    setTerm();

    //Opening first found U3 over USB
    if( (hDevice = openUSBConnection(-1)) == NULL )
        goto done;

    //Getting calibration information from U3
    if( getCalibrationInfo(hDevice, &caliInfo) < 0 )
        goto close;

    if( configIO_example(hDevice, 1, &dac1Enabled) != 0 )
        goto close;

    if( configTimerClock_example(hDevice) != 0 )
        goto close;

    if( caliInfo.hardwareVersion >= 1.30 && caliInfo.highVoltage == 1 )
    {
        if( feedback_setup_HV_example(hDevice, &caliInfo) != 0 )
            goto close;

        if( feedback_loop_HV_example(hDevice, &caliInfo) != 0 )
            goto close;
    }
    else
    {
        if( feedback_setup_example(hDevice, &caliInfo) != 0 )
            goto close;

        if( feedback_loop_example(hDevice, &caliInfo, dac1Enabled) != 0 )
            goto close;
    }

    configIO_example(hDevice, 0, &dac1Enabled);

close:
    closeUSBConnection(hDevice);
done:
    printf("\nDone\n");

    //Setting terminal settings to previous settings
    unsetTerm();
    return 0;
}

//Sends a ConfigIO low-level command that configures the FIOs, DAC, Timers and
//Counters for this example.
int configIO_example(HANDLE hDevice, int enable, int *isDAC1Enabled)
{
    uint8 sendBuff[12], recBuff[12];
    uint8 timerCounterConfig, fioAnalog;
    uint16 checksumTotal;
    int sendChars, recChars;

    if( enable == 0 )
    {
        timerCounterConfig = 64;  //Disabling timers (bits 0 and 1) and Counters
                                  //(bits 2 and 3), setting TimerCounterPinOffset
                                  //to 4 (bits 4-7)
        fioAnalog = 255;  //Setting all FIOs to analog
    }
    else
    {
        timerCounterConfig = 74;  //Enabling 2 timers (bits 0 and 1), Counter 1 (bit 3)
                                  //and setting TimerCounterPinOffset (bits 4-7) to
                                  //4.  Note that Counter 0 will not be available
                                  //since the timer clock will use a divisor in this
                                  //example.  Also, for hardware version 1.30, HV
                                  //models need to have a TimerCounterPinOffset of 4-8,
                                  //otherwise an error will occur since FIO0-FIO3 can only
                                  //be analog inputs.

        fioAnalog = 3;  //Setting FIO0 (bit 0) and FIO1 (bit 1) to analog input.  Note that
                        //hardware version 1.30, U3-HV models will always have FIO0-4 set as
                        //analog inputs, and will ignore setting chages.  In this case, FIO2
                        //and FIO3 will ignore the the digital setting and still be analog
                        //inputs.
    }

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = (uint8)(0x03);  //Number of data words
    sendBuff[3] = (uint8)(0x0B);  //Extended command number

    sendBuff[6] = 5;  //Writemask : Setting writemask for timerCounterConfig (bit 0)
                      //and FIOAnalog (bit 2)

    sendBuff[7] = 0;  //Reserved
    sendBuff[8] = timerCounterConfig;  //TimerCounterConfig
    sendBuff[9] = 0;  //DAC1 enable : not enabling, though could already be enabled.
                      //If U3 hardware version 1.30, DAC1 is always enabled.
    sendBuff[10] = fioAnalog;  //FIOAnalog
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

    if( recBuff[8] != timerCounterConfig )
    {
        printf("ConfigIO error : TimerCounterConfig did not get set correctly\n");
        return -1;
    }

    if( recBuff[10] != fioAnalog && recBuff[10] != (fioAnalog|(0x0F)) )
    {
        printf("ConfigIO error : FIOAnalog(%d) did not set correctly\n", recBuff[10]);
        return -1;
    }

    *isDAC1Enabled = (int)recBuff[9];

    return 0;
}

//Sends a ConfigTimerClock low-level command that configures the timer clock
//for this example.
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

    sendBuff[8] = 134;  //TimerClockConfig : Configuring the clock (bit 7) and
                        //setting the TimerClockBase (bits 0-2) to
                        //24MHz/TimerClockDivisor
    sendBuff[9] = 2;  //TimerClockDivisor : Setting to 2, so the actual timer
                      //clock is 12 MHz
    extendedChecksum(sendBuff, 10);

    //Sending command to U3
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 10)) < 10 )
    {
        if( sendChars == 0 )
            printf("ConfigTimerClock error : write failed\n");
        else
            printf("ConfigTimerClock error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from U3
    if( (recChars = LJUSB_Read(hDevice, recBuff, 10)) < 10 )
    {
        if( recChars == 0 )
            printf("ConfigTimerClock error : read failed\n");
        else
            printf("ConfigTimerClock error : did not read all of the buffer\n");
        return -1;
    }

    checksumTotal = extendedChecksum16(recBuff, 10);
    if( (uint8)((checksumTotal / 256 ) & 0xFF) != recBuff[5] )
    {
        printf("ConfigTimerClock error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xFF) != recBuff[4] )
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

    /*
    if( recBuff[8] != timerClockConfig )
    {
        printf("ConfigTimerClock error : TimerClockConfig did not get set correctly %d\n", recBuff[7]);
        return -1;
    }

    if( recBuff[9] != timerClockDivisor )
    {
        printf("ConfigTimerClock error : TimerClockDivisor did not get set correctly %d\n", recBuff[7]);
        return -1;
    }
    */
    return 0;
}

//Sends a Feedback low-level command that configures digital directions, states,
//timer modes and DAC0 for this example.  Will work with U3 hardware versions
//1.20, 1.21 and 1.30 LV.
int feedback_setup_example(HANDLE hDevice, u3CalibrationInfo *caliInfo)
{
    uint8 sendBuff[32], recBuff[18];
    uint16 checksumTotal;
    int sendChars, recChars;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = 13;  //Number of data words (.5 word for echo, 8 words for
                       //IOTypes and data, and .5 words for the extra byte)
    sendBuff[3] = (uint8)(0x00);  //Extended command number

    sendBuff[6] = 0;  //Echo

    sendBuff[7] = 13;  //IOType is BitDirWrite
    sendBuff[8] = 130;  //IONumber (bits 0 - 4) is 2 and Direction (bit 7) is
                        //output

    sendBuff[9] = 13;  //IOType is BitDirWrite
    sendBuff[10] = 3;  //IONumber (bits 0 - 4) is 3 and Direction (bit 7) is
                       //input

    sendBuff[11] = 11;  //IOType is BitStateWrite
    sendBuff[12] = 2;  //IONumber (bits 0 - 4) is 2 and State (bit 7) is low

    sendBuff[13] = 43;  //IOType is Timer0Config
    sendBuff[14] = 0;  //TimerMode is 16 bit PWM output (mode 0)
    sendBuff[15] = 0;  //Value LSB
    sendBuff[16] = 0;  //Value MSB, Whole value is 32768

    sendBuff[17] = 42;  //IOType is Timer0
    sendBuff[18] = 1;  //UpdateReset
    sendBuff[19] = 0;  //Value LSB
    sendBuff[20] = 128;  //Value MSB, Whole Value is 32768

    sendBuff[21] = 45;  //IOType is Timer1Config
    sendBuff[22] = 1;  //TimerMode is 8 bit PWM output (mode 1)
    sendBuff[23] = 0;  //Value LSB
    sendBuff[24] = 0;  //Value MSB, Whole value is 32768

    sendBuff[25] = 44;  //IOType is Timer1
    sendBuff[26] = 1;  //UpdateReset
    sendBuff[27] = 0;  //Value LSB
    sendBuff[28] = 128;  //Value MSB, Whole Value is 32768

    sendBuff[29] = 34;  //IOType is DAC0 (8-bit)

    //Value is 1.5 volts (in binary form)
    getDacBinVoltCalibrated8Bit(caliInfo, 0, 1.5, &sendBuff[30]);
    sendBuff[31] = 0;  //Extra byte

    extendedChecksum(sendBuff, 32);

    //Sending command to U3
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 32)) < 32 )
    {
        if( sendChars == 0 )
            printf("Feedback setup error : write failed\n");
        else
            printf("Feedback setup error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from U3
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
    if( (uint8)((checksumTotal / 256 ) & 0xFF) != recBuff[5] )
    {
        printf("Feedback setup error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xFF) != recBuff[4] )
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

//Sends a Feedback low-level command that configures digital directions, states,
//timer modes and DAC0 for this example.  Meant for U3 hardware versions 1.30 HV
//example purposes, but will work with LV as well.
int feedback_setup_HV_example(HANDLE hDevice, u3CalibrationInfo *caliInfo)
{
    uint8 sendBuff[28], recBuff[18];
    uint16 binVoltage16, checksumTotal;
    int sendChars, recChars;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = 11;  //Number of data words (.5 word for echo, 10.5 words for
                       //IOTypes and data)
    sendBuff[3] = (uint8)(0x00);  //Extended command number

    sendBuff[6] = 0;  //Echo

    sendBuff[7] = 13;  //IOType is BitDirWrite
    sendBuff[8] = 7;  //IONumber (bits 0 - 4) is 7 and Direction (bit 7) is
                      //input

    sendBuff[9] = 43;  //IOType is Timer0Config
    sendBuff[10] = 0;  //TimerMode is 16 bit PWM output (mode 0)
    sendBuff[11] = 0;  //Value LSB
    sendBuff[12] = 0;  //Value MSB, Whole value is 32768

    sendBuff[13] = 42;  //IOType is Timer0
    sendBuff[14] = 1;  //UpdateReset
    sendBuff[15] = 0;  //Value LSB
    sendBuff[16] = 128;  //Value MSB, Whole Value is 32768

    sendBuff[17] = 45;  //IOType is Timer1Config
    sendBuff[18] = 1;  //TimerMode is 8 bit PWM output (mode 1)
    sendBuff[19] = 0;  //Value LSB
    sendBuff[20] = 0;  //Value MSB, Whole value is 32768

    sendBuff[21] = 44;  //IOType is Timer1
    sendBuff[22] = 1;  //UpdateReset
    sendBuff[23] = 0;  //Value LSB
    sendBuff[24] = 128;  //Value MSB, Whole Value is 32768

    sendBuff[25] = 38;  //IOType is DAC0 (16-bit)

    //Value is 3.5 volts (in binary form)
    getDacBinVoltCalibrated16Bit(caliInfo, 0, 3.5, &binVoltage16);
    sendBuff[26] = (uint8)(binVoltage16&255);  //Value LSB
    sendBuff[27] = (uint8)((binVoltage16&65280)/256);  //Value MSB
    extendedChecksum(sendBuff, 28);

    //Sending command to U3
    if( (sendChars = LJUSB_Write(hDevice, sendBuff, 28)) < 28 )
    {
        if( sendChars == 0 )
            printf("Feedback setup HV error : write failed\n");
        else
            printf("Feedback setup HV error : did not write all of the buffer\n");
        return -1;
    }

    //Reading response from U3
    if( (recChars = LJUSB_Read(hDevice, recBuff, 18)) < 18 )
    {
        if( recChars == 0 )
        {
            printf("Feedback setup HV error : read failed\n");
            return -1;
        }
        else
            printf("Feedback setup HV error : did not read all of the buffer\n");
    }

    checksumTotal = extendedChecksum16(recBuff, 18);
    if( (uint8)((checksumTotal / 256 ) & 0xFF) != recBuff[5] )
    {
        printf("Feedback setup HV error : read buffer has bad checksum16(MSB)\n");
        return -1;
    }

    if( (uint8)(checksumTotal & 0xFF) != recBuff[4] )
    {
        printf("Feedback setup HV error : read buffer has bad checksum16(LBS)\n");
        return -1;
    }

    if( extendedChecksum8(recBuff) != recBuff[0] )
    {
        printf("Feedback setup HV error : read buffer has bad checksum8\n");
        return -1;
    }

    if( recBuff[1] != (uint8)(0xF8) || recBuff[2] != 6 || recBuff[3] != (uint8)(0x00) )
    {
        printf("Feedback setup HV error : read buffer has wrong command bytes \n");
        return -1;
    }

    if( recBuff[6] != 0 )
    {
        printf("Feedback setup HV error : received errorcode %d for frame %d in Feedback response. \n", recBuff[6], recBuff[7]);
        return -1;
    }

    return 0;
}

//Calls a Feedback low-level call to read AIN0, AIN1, FIO3, Counter1(FIO6) and
//temperature.  Will work with U3 hardware versions 1.20, 1.21 and 1.30 LV.
int feedback_loop_example(HANDLE hDevice, u3CalibrationInfo *caliInfo, int isDAC1Enabled)
{
    uint8 sendBuff[32], recBuff[28];
    uint16 checksumTotal;
    int sendChars, recChars;
    long count;
    double voltage, temperature;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = 13;  //Number of data words (.5 word for echo, 12.5 words for
                       //IOTypes)
    sendBuff[3] = (uint8)(0x00);  //Extended command number

    sendBuff[6] = 0;  //Echo

    sendBuff[7] = 1;  //IOType is AIN
    sendBuff[8] = 0;  //Positive channel (bits 0-4) is 0, LongSettling (bit 6)
                      //is not set and QuickSample (bit 7) is not set
    sendBuff[9] = 31;  //Negative channel is 31 (SE)

    sendBuff[10] = 1;  //IOType is AIN
    sendBuff[11] = 1;  //Positive channel (bits 0-4) is 1, LongSettling (bit 6)
                       //is not set and QuickSample (bit 7) is not set
    sendBuff[12] = 31;  //Negative channel is 31 (SE)

    sendBuff[13] = 1;  //IOType is AIN
    sendBuff[14] = 0;  //Positive channel (bits 0-4) is 0, LongSettling (bit 6)
                       //is not set and QuickSample (bit 7) is not set
    sendBuff[15] = 1;  //Negative channel is 1 (FIO1)

    sendBuff[16] = 1;  //IOType is AIN
    sendBuff[17] = 1;  //Positive channel (bits 0-4) is 1, LongSettling (bit 6)
                       //is not set and QuickSample (bit 7) is not set
    sendBuff[18] = 0;  //Negative channel is 0 (FIO0)

    sendBuff[19] = 1;  //IOType is AIN
    sendBuff[20] = 0;  //Positive channel (bits 0-4) is 0, LongSettling (bit 6)
                       //is not set and QuickSample (bit 7) is not set
    sendBuff[21] = 30;  //Negative channel is 30 (Vref)

    sendBuff[22] = 1;  //IOType is AIN
    sendBuff[23] = 1;  //Positive channel (bits 0-4) is 1, LongSettling (bit 6)
                       //is not set and QuickSample (bit 7) is not set
    sendBuff[24] = 30;  //Negative channel is 30 (Vref)

    sendBuff[25] = 10;  //IOType is BitStateRead
    sendBuff[26] = 3;  //IO number is 3 (FIO3)

    sendBuff[27] = 55;  //IOType is Counter1
    sendBuff[28] = 0;  //Reset (bit 0) is not set

    sendBuff[29] = 1;  //IOType is AIN
    sendBuff[30] = 30;  //Positive channel is 30 (temp sensor)
    sendBuff[31] = 31;  //Negative channel is 31 (SE)

    extendedChecksum(sendBuff, 32);

    printf("Running Feedback calls in a loop\n");

    count = 0;
    while( !kbhit() )
    {
        count++;
        printf("Iteration %ld\n", count);

        //Sending command to U3
        if( (sendChars = LJUSB_Write(hDevice,  sendBuff, 32)) < 32 )
        {
            if( sendChars == 0 )
              printf("Feedback loop error : write failed\n");
            else
              printf("Feedback loop error : did not write all of the buffer\n");
            return -1;
        }

        //Reading response from U3
        if( (recChars = LJUSB_Read(hDevice, recBuff, 28)) < 28 )
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
        if( (uint8)((checksumTotal / 256 ) & 0xFF) != recBuff[5] )
        {
            printf("Feedback loop error : read buffer has bad checksum16(MSB)\n");
            return -1;
        }

        if( (uint8)(checksumTotal & 0xFF) != recBuff[4] )
        {
            printf("Feedback loop error : read buffer has bad checksum16(LBS)\n");
            return -1;
        }

        if( extendedChecksum8(recBuff) != recBuff[0] )
        {
            printf("Feedback loop error : read buffer has bad checksum8\n");
            return -1;
        }

        if( recBuff[1] != (uint8)(0xF8) ||	recBuff[3] != (uint8)(0x00) )
        {
            printf("Feedback loop error : read buffer has wrong command bytes \n");
            return -1;
        }

        if( recBuff[6] != 0 )
        {
            printf("Feedback loop error : received errorcode %d for frame %d ", recBuff[6], recBuff[7]); 
            switch( recBuff[7] )
            {
                case 1: printf("(AIN(SE))\n"); break;
                case 2: printf("(AIN(SE))\n"); break;
                case 3: printf("(AIN(Neg. chan. 1))\n"); break;
                case 4: printf("(AIN(Neg. chan. 0))\n"); break;
                case 5: printf("(AIN(Neg. chan. Vref))\n"); break;
                case 6: printf("(AIN(Neg. chan. Vref))\n"); break;
                case 7: printf("(BitStateRead for FIO3)\n"); break;
                case 8: printf("(Counter1)\n"); break;
                case 9: printf("(Temp. Sensor\n"); break;
                default: printf("(Unknown)\n"); break;
            }
            return -1;
        }

        getAinVoltCalibrated(caliInfo, isDAC1Enabled, 31, recBuff[9] + recBuff[10]*256, &voltage);
        printf("AIN0(SE) : %.3f volts\n", voltage);
        getAinVoltCalibrated(caliInfo, isDAC1Enabled, 31, recBuff[11] + recBuff[12]*256, &voltage);
        printf("AIN1(SE) : %.3f volts\n", voltage);
        getAinVoltCalibrated(caliInfo, isDAC1Enabled, 1, recBuff[13] + recBuff[14]*256, &voltage);
        printf("AIN0(Neg. chan. 1) : %.3f volts\n", voltage);
        getAinVoltCalibrated(caliInfo, isDAC1Enabled, 0, recBuff[15] + recBuff[16]*256, &voltage);
        printf("AIN1(Neg. chan. 0): %.3f volts\n", voltage);
        getAinVoltCalibrated(caliInfo, isDAC1Enabled, 30, recBuff[17] + recBuff[18]*256, &voltage);
        printf("AIN0(Neg. chan. Vref) : %.3f volts\n", voltage);
        getAinVoltCalibrated(caliInfo, isDAC1Enabled, 30, recBuff[19] + recBuff[20]*256, &voltage);
        printf("AIN1(Neg. chan. Vref): %.3f volts\n", voltage);
        printf("FIO3 state : %d\n", recBuff[21]);
        printf("Counter1(FIO6) : %u\n\n", recBuff[22] + recBuff[23]*256 + recBuff[24]*65536 + recBuff[25]*16777216);
        getTempKCalibrated(caliInfo, recBuff[26] + recBuff[27]*256, &temperature);
        printf("Temperature : %.3f K\n\n", temperature);
        sleep(1);
    }
    return 0;
}

//Calls a Feedback low-level call to read AIN0, AIN1, FIO7, Counter1(FIO6) and
//temperature.  Will work with U3 hardware versions 1.30 HV.
int feedback_loop_HV_example(HANDLE hDevice, u3CalibrationInfo *caliInfo)
{
    uint8 sendBuff[26], recBuff[24];
    uint16 checksumTotal;
    int sendChars, recChars;
    long count;
    double voltage, temperature;

    sendBuff[1] = (uint8)(0xF8);  //Command byte
    sendBuff[2] = 10;  //Number of data words (.5 word for echo, 9.5 words for
                       //IOTypes)
    sendBuff[3] = (uint8)(0x00);  //Extended command number

    sendBuff[6] = 0;  //Echo

    sendBuff[7] = 1;  //IOType is AIN
    sendBuff[8] = 0;  //Positive channel (bits 0-4) is 0, LongSettling (bit 6)
                      //is not set and QuickSample (bit 7) is not set
    sendBuff[9] = 31;  //Negative channel is 31 (SE)

    sendBuff[10] = 1;  //IOType is AIN
    sendBuff[11] = 1;  //Positive channel (bits 0-4) is 1, LongSettling (bit 6)
                        //is not set and QuickSample (bit 7) is not set
    sendBuff[12] = 31;  //Negative channel is 31 (SE)

    sendBuff[13] = 1;  //IOType is AIN
    sendBuff[14] = 2;  //Positive channel (bits 0-4) is 3, LongSettling (bit 6)
                       //is not set and QuickSample (bit 7) is not set
    sendBuff[15] = 31;  //Negative channel is 31 (SE)

    sendBuff[16] = 1;  //IOType is AIN
    sendBuff[17] = 3;  //Positive channel (bits 0-4) is 4, LongSettling (bit 6)
                        //is not set and QuickSample (bit 7) is not set
    sendBuff[18] = 31;  //Negative channel is 31 (SE)

    sendBuff[19] = 10;  //IOType is BitStateRead
    sendBuff[20] = 7;  //IO number is 7 (FIO7)

    sendBuff[21] = 55;  //IOType is Counter1
    sendBuff[22] = 0;  //Reset (bit 0) is not set

    sendBuff[23] = 1;  //IOType is AIN
    sendBuff[24] = 30;  //Positive channel is 30 (temp sensor)
    sendBuff[25] = 31;  //Negative channel is 31 (SE)

    extendedChecksum(sendBuff, 26);

    printf("Running Feedback calls in a loop\n");

    count = 0;
    while( !kbhit() )
    {
        count++;
        printf("Iteration %ld\n", count);

        //Sending command to U3
        if( (sendChars = LJUSB_Write(hDevice, sendBuff, 26)) < 26 )
        {
            if( sendChars == 0 )
                printf("Feedback loop HV error : write failed\n");
            else
                printf("Feedback loop HV error : did not write all of the buffer\n");
            return -1;
        }

        //Reading response from U3
        if( (recChars = LJUSB_Read(hDevice, recBuff, 24)) < 24 )
        {
            if( recChars == 0 )
            {
                printf("Feedback loop HV error : read failed\n");
                return -1;
            }
            else
                printf("Feedback loop HV error : did not read all of the expected buffer\n");
        }

        if( recChars < 10 )
        {
            printf("Feedback loop HV error : response is not large enough\n");
            return -1;
        }

        checksumTotal = extendedChecksum16(recBuff, recChars);
        if( (uint8)((checksumTotal / 256 ) & 0xFF) != recBuff[5] )
        {
            printf("Feedback loop HV error : read buffer has bad checksum16(MSB)\n");
            return -1;
        }

        if( (uint8)(checksumTotal & 0xFF) != recBuff[4] )
        {
            printf("Feedback loop HV error : read buffer has bad checksum16(LBS)\n");
            return -1;
        }

        if( extendedChecksum8(recBuff) != recBuff[0] )
        {
            printf("Feedback loop HV error : read buffer has bad checksum8\n");
            return -1;
        }

        if( recBuff[1] != (uint8)(0xF8) ||  recBuff[3] != (uint8)(0x00) )
        {
            printf("Feedback loop HV error : read buffer has wrong command bytes \n");
            return -1;
        }

        if( recBuff[6] != 0 )
        {
            printf("Feedback loop HV error : received errorcode %d for frame %d ", recBuff[6], recBuff[7]); 
            switch( recBuff[7] )
            {
                case 1: printf("(AIN0(SE))\n"); break;
                case 2: printf("(AIN1(SE))\n"); break;
                case 3: printf("(AIN2(SE))\n"); break;
                case 4: printf("(AIN3(SE))\n"); break;
                case 5: printf("(BitStateRead for FIO7)\n"); break;
                case 6: printf("(Counter1)\n"); break;
                case 7: printf("(Temp. Sensor\n"); break;
                default: printf("(Unknown)\n"); break;
            }
            return -1;
        }

        getAinVoltCalibrated_hw130(caliInfo, 0, 31, recBuff[9] + recBuff[10]*256, &voltage);
        printf("AIN0(SE) : %.3f volts\n", voltage);
        getAinVoltCalibrated_hw130(caliInfo, 1, 31, recBuff[11] + recBuff[12]*256, &voltage);
        printf("AIN1(SE) : %.3f volts\n", voltage);
        getAinVoltCalibrated_hw130(caliInfo, 2, 31, recBuff[13] + recBuff[14]*256, &voltage);
        printf("AIN2(SE) : %.3f volts\n", voltage);
        getAinVoltCalibrated_hw130(caliInfo, 3, 31, recBuff[15] + recBuff[16]*256, &voltage);
        printf("AIN3(SE) : %.3f volts\n", voltage);
        printf("FIO7 state : %d\n", recBuff[17]);
        printf("Counter1(FIO6) : %u\n\n", recBuff[18] + recBuff[19]*256 + recBuff[20]*65536 + recBuff[21]*16777216);
        getTempKCalibrated(caliInfo, recBuff[22] + recBuff[23]*256, &temperature);
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

    termNew.c_cc[VMIN] = 0;
    tcsetattr(0, TCSANOW, &termNew);
    nread = read(0, &ch, 1);
    termNew.c_cc[VMIN] = 1;
    tcsetattr(0, TCSANOW, &termNew);

    if(nread == 1)
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
