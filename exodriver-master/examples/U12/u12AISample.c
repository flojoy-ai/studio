/*
An example that shows a minimal use of Exodriver without the use of functions
hidden in header files.

You can compile this example with the following command:
  $ g++ -lm -llabjackusb u12AISample.c

It is also included in the Makefile.

*/

/* Includes */
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include "labjackusb.h"
#include <libusb-1.0/libusb.h>

// All U12 commands are 8 bytes.
#define U12_COMMAND_LENGTH 8

/* LabJack Related Helper Functions Protoypes */

int writeRead(HANDLE devHandle, BYTE * sendBuffer, BYTE * recBuffer );

// Demonstrates how to build the AIStream packet.
void buildAISampleBytes(BYTE * sendBuffer);

// Demonstrates how to parse the response of AIStream.
void parseAISampleBytes(BYTE * recBuffer);

int main() {
    // Setup the variables we will need.
    int r = 0; // For checking return values
    HANDLE devHandle = 0;
    BYTE sendBuffer[U12_COMMAND_LENGTH], recBuffer[U12_COMMAND_LENGTH];

    // Open the U12
    devHandle = LJUSB_OpenDevice(1, 0, U12_PRODUCT_ID);
    
    if( devHandle == NULL ) {
        printf("Couldn't open U12. Please connect one and try again.\n");
        exit(-1);
    }

    // Builds the AISample command
    buildAISampleBytes(sendBuffer);
    
    // Write the command, and read the response.
    r = writeRead(devHandle, sendBuffer, recBuffer );
    
    // If the U12 is freshly plugged in, then it will not respond to the
    // first command. Write it again.
    if( r == -1){
        r = writeRead(devHandle, sendBuffer, recBuffer );
        
        if(r != 0){
            // If you still have errors after the first try, then you have
            // bigger problems.
            printf("Command timed out twice. Exiting...");
            LJUSB_CloseDevice(devHandle);
            exit(-1);
        }
    }
    
    // Parse the response into something useful
    parseAISampleBytes(recBuffer);
    
    //Close the device.
    LJUSB_CloseDevice(devHandle);
    
    return 0;
}

/* ------------- LabJack Related Helper Functions Definitions ------------- */

int writeRead(HANDLE devHandle, BYTE * sendBuffer, BYTE * recBuffer ) {
    int r = 0;
    
    // Write the command to the device.
    // LJUSB_Write( handle, sendBuffer, length of sendBuffer )
    r = LJUSB_Write( devHandle, sendBuffer, U12_COMMAND_LENGTH );
    
    if( r != U12_COMMAND_LENGTH ) {
        printf("An error occurred when trying to write the buffer. The error was: %d\n", errno);
        // *Always* close the device when you error out.
        LJUSB_CloseDevice(devHandle);
        exit(-1);
    }
    
    // Read the result from the device.
    // LJUSB_Read( handle, recBuffer, number of bytes to read)
    r = LJUSB_Read( devHandle, recBuffer, U12_COMMAND_LENGTH );
    
    if( r != U12_COMMAND_LENGTH ) {
        if(errno == LIBUSB_ERROR_TIMEOUT) {
            return -1;
        }
        
        printf("An error occurred when trying to read from the U12. The error was: %d\n", errno);
        LJUSB_CloseDevice(devHandle);
        exit(-1);
    }
    
    return 0;
}


// Uses information from section 5.1 of the U12 User's Guide to make a AISample
// packet.
// http://labjack.com/support/u12/users-guide/5.1
void buildAISampleBytes(BYTE * sendBuffer) {    
    // Build up the bytes
    sendBuffer[0] = 8;   // Set PGAMUX for single-ended AI0
    sendBuffer[1] = 9;   // Set PGAMUX for single-ended AI1
    sendBuffer[2] = 10;  // Set PGAMUX for single-ended AI2
    sendBuffer[3] = 11;  // Set PGAMUX for single-ended AI3
    sendBuffer[4] = 1;   // UpdateIO = 0, LEDState = 1
    sendBuffer[5] = 192; // 0b11000000 = (AISample)
    sendBuffer[6] = 0;   // XXXXXXXX
    sendBuffer[7] = 0;   // Echo Value
    
    // The bytes have been set. We are ready to write to the U12.
}

// Parses the AISample packet into something useful.
void parseAISampleBytes(BYTE * recBuffer){
    int temp;
    double ai0, ai1, ai2, ai3;
    
    // Apply the single-ended conversion to results
    temp = (recBuffer[2] >> 4) & 0xf;
    temp = (temp << 8) + recBuffer[3];
    ai0 = ((double)temp * 20.0 / 4096.0) - 10;
    
    temp = recBuffer[2] & 0xf;
    temp = (temp << 8) + recBuffer[4];
    ai1 = ((double)temp * 20.0 / 4096.0) - 10;
    
    temp = (recBuffer[5] >> 4) & 0xf;
    temp = (temp << 8) + recBuffer[6];
    ai2 = ((double)temp * 20.0 / 4096.0) - 10;
    
    temp = recBuffer[5] & 0xf;
    temp = (temp << 8) + recBuffer[7];
    ai3 = ((double)temp * 20.0 / 4096.0) - 10;

    printf("Results of AISample:\n");
    printf("  AI0 = %f\n", ai0);
    printf("  AI1 = %f\n", ai1);
    printf("  AI2 = %f\n", ai2);
    printf("  AI3 = %f\n", ai3);
    printf("  PGA Overvoltage = %d\n", (recBuffer[0] >> 4) & 1);
    printf("  IO3 to IO0 States = %d\n", recBuffer[0] & 15);
    printf("  TimerCounterMask = %d\n", recBuffer[22]);
    
}