//Author: LabJack
//April 12, 2016
//This example demonstrates with the "easy" functions how to set an analog
//output (DAC), read an analog input (AIN), set a digital output, read a
//digital input, and configure/update/read timers and counters.

#include "u6.h"
#include <unistd.h>

int main(int argc, char **argv)
{
    HANDLE hDevice;
    u6CalibrationInfo caliInfo;
    int localID;
    long error;
    double dblVoltage;
    long lngState;
    long lngTCPinOffset;
    long lngTimerClockBaseIndex;
    long lngTimerClockDivisor;
    long alngEnableTimers[4];
    long alngTimerModes[4];
    double adblTimerValues[4];
    long alngEnableCounters[2];
    long alngReadTimers[4];
    long alngUpdateResetTimers[4];
    long alngReadCounters[2];
    long alngResetCounters[2];
    double adblCounterValues[2];
    double highTime;
    double lowTime;
    double dutyCycle;

    //Open first found U6 over USB
    localID = -1;
    hDevice = openUSBConnection(localID);
    if( hDevice == NULL )
        goto done;

    //Get calibration information from U6
    error = getCalibrationInfo(hDevice, &caliInfo);
    if( error < 0 )
        goto close;


    //Set DAC0 to 3.1 volts.
    printf("Calling eDAC to set DAC0 to 3.1 V\n");
    error = eDAC(hDevice, &caliInfo, 0, 3.1, 0, 0, 0);
    if( error != 0 )
        goto close;


    //Read AIN3 single-ended voltage. +/-10 volt range and default resolution (0).
    printf("\nCalling eAIN to read AIN3 voltage\n");
    dblVoltage = 0.0;
    error = eAIN(hDevice, &caliInfo, 3, 15, &dblVoltage, LJ_rgBIP10V, 0, 0, 0, 0, 0);
    if( error != 0 )
        goto close;
    printf("AIN3 value = %.3f\n", dblVoltage);


    //Set FIO2 to output-high
    printf("\nCalling eDO to set FIO2 to output-high\n");
    error = eDO(hDevice, 2, 1);
    if( error != 0 )
        goto close;


    //Read FIO3 state
    printf("\nCalling eDI to read FIO3 state\n");
    lngState = 0;
    error = eDI(hDevice, 3, &lngState);
    if( error != 0 )
        goto close;
    printf("FIO3 state = %ld\n", lngState);


    //Enable and configure 1 output timer, 1 input timer, and
    //1 counter
    printf("\nCalling eTCConfig to enable and configure 1 output timer (Timer0), 1 input timer (Timer1), and 1 counter (Counter1)\n");
    alngEnableTimers[0] = 1;  //Enable Timer0 (uses FIO0)
    alngEnableTimers[1] = 1;  //Enable Timer1 (uses FIO1)
    alngEnableTimers[2] = 0;  //Disable Timer2
    alngEnableTimers[3] = 0;  //Disable Timer3
    alngEnableCounters[0] = 0;  //Disable Counter0
    alngEnableCounters[1] = 1;  //Enable Counter1 (uses FIO3)
    lngTCPinOffset = 0;  //Offset is 0, so timers/counters start at FIO0
    lngTimerClockBaseIndex = LJ_tc48MHZ_DIV;  //Base clock is 48 MHz with divisor support, so Counter0 is disabled
    lngTimerClockDivisor = 48;  //Base clock divisor. Makes the clock 1 MHz.
    alngTimerModes[0] = LJ_tmPWM8;  //Timer0 is 8-bit PWM output. Frequency is 1M/256 = 3906.
    alngTimerModes[1] = LJ_tmDUTYCYCLE;  //Timer1 is duty cycle
    alngTimerModes[2] = 0;
    alngTimerModes[3] = 0;
    adblTimerValues[0] = 16384;  //Set PWM8 duty-cycle to 75%.
    adblTimerValues[1] = 0;
    adblTimerValues[2] = 0;
    adblTimerValues[3] = 0;
    error = eTCConfig(hDevice, alngEnableTimers, alngEnableCounters, lngTCPinOffset, lngTimerClockBaseIndex, lngTimerClockDivisor, alngTimerModes, adblTimerValues, 0, 0);
    if( error != 0 )
        goto close;

    printf("\nWaiting for 1 second...\n");
    sleep(1);

    //Update the value (duty-cycle) of output timer (Timer0),
    //read and reset the input timer (Timer1), and
    //read and reset the counter (Counter1).
    printf("\nCalling eTCValues to update the value (duty-cycle) of output Timer0, read/reset input Timer1, and read/reset Counter1\n");
    alngReadTimers[0] = 0;  //Don't read Timer0 (output timer)
    alngReadTimers[1] = 1;  //Read Timer1
    alngReadTimers[2] = 0;
    alngReadTimers[3] = 0;
    alngUpdateResetTimers[0] = 1;  //Update Timer0
    alngUpdateResetTimers[1] = 1;  //Reset Timer1
    alngUpdateResetTimers[2] = 0;
    alngUpdateResetTimers[3] = 0;
    alngReadCounters[0] = 0;
    alngReadCounters[1] = 1;  //Read Counter1
    alngResetCounters[0] = 0;
    alngResetCounters[1] = 1;  //Reset Counter1
    adblTimerValues[0] = 32768;  //Change Timer0 duty-cycle to 50%
    adblTimerValues[1] = 0;
    adblTimerValues[2] = 0;
    adblTimerValues[3] = 0;
    adblCounterValues[0] = 0;
    adblCounterValues[1] = 0;
    error = eTCValues(hDevice, alngReadTimers, alngUpdateResetTimers, alngReadCounters, alngResetCounters, adblTimerValues, adblCounterValues, 0, 0);
    if( error != 0 )
        goto close;

    //Convert Timer1 value to duty-cycle percentage
    //High time is LSW
    highTime = (double)((unsigned long)adblTimerValues[1]%65536);
    //Low time is MSW
    lowTime = (double)((unsigned long)adblTimerValues[1]/65536);
    //Duty cycle percentage
    dutyCycle = 100*highTime/(highTime + lowTime);
    printf("Timer1 value = %.0f\n", adblTimerValues[1]);
    printf("    High Clicks = %.0f\n", highTime);
    printf("    Low Clicks = %.0f\n", lowTime);
    printf("    Duty Cycle = %.1f%%\n", dutyCycle);
    printf("Counter1 value = %.0f\n", adblCounterValues[1]);

    //Disable all timers and counters
    alngEnableTimers[0] = 0;
    alngEnableTimers[1] = 0;
    alngEnableTimers[2] = 0;
    alngEnableTimers[3] = 0;
    alngEnableCounters[0] = 0;
    alngEnableCounters[1] = 0;
    error = eTCConfig(hDevice, alngEnableTimers, alngEnableCounters, 0, LJ_tc48MHZ, 0, alngTimerModes, adblTimerValues, 0, 0);
    if( error != 0 )
        goto close;
    printf("\nCalling eTCConfig to disable all timers and counters\n");

close:
    if( error > 0 )
        printf("Received an error code of %ld\n", error);
    closeUSBConnection(hDevice);

done:
    return 0;
}

