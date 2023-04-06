//Author: LabJack
//April 12, 2016
//This example demonstrates with the "easy" functions how to set an analog
//output (DAC), read an analog input (AIN), set a digital output, read a
//digital input, and configure/update/read timers and counters.

#include "u3.h"
#include <unistd.h>

int main(int argc, char **argv)
{
    HANDLE hDevice;
    u3CalibrationInfo caliInfo;
    int localID;
    long DAC1Enable;
    long error;
    double dblVoltage;
    long lngState;
    long lngTCPinOffset;
    long lngTimerClockBaseIndex;
    long lngTimerClockDivisor;
    long alngEnableTimers[2];
    long alngTimerModes[2];
    double adblTimerValues[2];
    long alngEnableCounters[2];
    long alngReadTimers[2];
    long alngUpdateResetTimers[2];
    long alngReadCounters[2];
    long alngResetCounters[2];
    double adblCounterValues[2];
    double highTime;
    double lowTime;
    double dutyCycle;

    //Open first found U3 over USB
    localID = -1;
    hDevice = openUSBConnection(localID);
    if( hDevice  == NULL )
        goto done;

    //Get calibration information from U3
    error = getCalibrationInfo(hDevice, &caliInfo);
    if( error < 0 )
        goto close;


    /* Note: The eAIN, eDAC, eDI, and eDO "easy" functions have the ConfigIO
     * parameter.  If calling, for example, eAIN multiple times to read AIN5,
     * in your first call set the ConfigIO parameter to 1 (True) so the channel
     * is configured to an analog input. This adds an additional one or two U3
     * command/responses in the call.  In following calls, set the ConfigIO
     * parameter to 0 (False) since the channel is already configured. For the
     * U3-HV, ConfigIO is ignored for dedicated analog inputs AIN0-AIN3.
     */


    //Set DAC0 to 2.1 volts
    printf("Calling eDAC to set DAC0 to 2.1 V\n");
    error = eDAC(hDevice, &caliInfo, 0, 0, 2.1, 0, 0, 0);
    if( error != 0 )
        goto close;

    sleep(1);


    /* Note for U3 hardware versions older than 1.30 (does not include the
     * U3-HV or LV):
     * The eAIN "easy" function has the DAC1Enable parameter that is used to
     * calculate the correct voltage.  In addition to the previous note, set
     * ConfigIO to 1 (True) on the first eAIN call for it to read/return the
     * DAC1Enable setting from the U3. For following eAIN calls, set ConfigIO
     * to 0 (False) and use the returned DAC1Enable value.  If DAC1 is
     * enabled/disabled in a later eDAC or ConfigIO low-level call, change the
     * DAC1Enable value accordingly or make another eAIN call with the ConfigIO
     * parameter set to 1.
     */

    //Read AIN3 single-ended voltage
    printf("\nCalling eAIN to read AIN3 voltage\n");
    dblVoltage = 0.0;
    error = eAIN(hDevice, &caliInfo, 1, &DAC1Enable, 3, 31, &dblVoltage, 0, 0, 0, 0, 0, 0);
    if( error != 0 )
        goto close;
    printf("AIN3 value = %.3f\n", dblVoltage);


    //Set FIO5 to output-high
    printf("\nCalling eDO to set FIO5 to output-high\n");
    error = eDO(hDevice, 1, 5, 1);
    if( error != 0 )
        goto close;


    //Read FIO4 state
    printf("\nCalling eDI to read FIO4 state\n");
    lngState = 0;
    error = eDI(hDevice, 1, 4, &lngState);
    if( error != 0 )
        goto close;
    printf("FIO4 state = %ld\n", lngState);


    //Enable and configure 1 output timer, 1 input timer, and
    //1 counter
    printf("\nCalling eTCConfig to enable and configure 1 output timer (Timer0), 1 input timer (Timer1), and 1 counter (Counter1)\n");
    alngEnableTimers[0] = 1;  //Enable Timer0 (uses FIO4)
    alngEnableTimers[1] = 1;  //Enable Timer1 (uses FIO5)
    alngEnableCounters[0] = 0;  //Disable Counter0
    alngEnableCounters[1] = 1;  //Enable Counter1 (uses FIO6)
    lngTCPinOffset = 4;  //Offset is 4, so timers/counters start at FIO4
    lngTimerClockBaseIndex = LJ_tc48MHZ_DIV;  //Base clock is 48 MHz with divisor support, so Counter0 is disabled
    lngTimerClockDivisor = 48;  //Base clock divisor. Makes the clock 1 MHz.
    alngTimerModes[0] = LJ_tmPWM8;  //Timer0 is 8-bit PWM output. Frequency is 1M/256 = 3906.
    alngTimerModes[1] = LJ_tmDUTYCYCLE;  //Timer1 is duty cycle
    adblTimerValues[0] = 16384;  //Set PWM8 duty-cycle to 75%.
    adblTimerValues[1] = 0;
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
    alngUpdateResetTimers[0] = 1;  //Update Timer0
    alngUpdateResetTimers[1] = 1;  //Reset Timer1
    alngReadCounters[0] = 0;
    alngReadCounters[1] = 1;  //Read Counter1
    alngResetCounters[0] = 0;
    alngResetCounters[1] = 1;  //Reset Counter1
    adblCounterValues[0] = 0;
    adblCounterValues[1] = 0;
    adblTimerValues[0] = 32768;  //Change Timer0 duty-cycle to 50%
    adblTimerValues[1] = 0;
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
    alngEnableCounters[0] = 0;
    alngEnableCounters[1] = 0;
    error = eTCConfig(hDevice, alngEnableTimers, alngEnableCounters, 4, LJ_tc48MHZ, 0, alngTimerModes, adblTimerValues, 0, 0);
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

