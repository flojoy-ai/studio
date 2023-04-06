/*
An example that shows a minimal use of Exodriver without the use of functions
hidden in header files.

You can compile this example with the following command:
  $ g++ -lm -llabjackusb u3BasicConfigU3.c

It is also included in the Makefile.

*/

/* Includes */
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include "labjackusb.h"

// Defines how long the command is
#define CONFIGU3_COMMAND_LENGTH 26

// Defines how long the response is
#define CONFIGU3_RESPONSE_LENGTH 38

/* Buffer Helper Functions Protypes */
// Takes a buffer and an offset, and turns it into a 32-bit integer
int makeInt(BYTE * buffer, int offset);

// Takes a buffer and an offset, and turns it into a 16-bit integer
int makeShort(BYTE * buffer, int offset);

// Takes a buffer and calculates the checksum8 of it.
BYTE calculateChecksum8(BYTE* buffer);

// Takes a buffer and length, and calculates the checksum16 of the buffer.
int calculateChecksum16(BYTE* buffer, int len);

/* LabJack Related Helper Functions Protoypes */

// Demonstrates how to build the ConfigU3 packet.
void buildConfigU3Bytes(BYTE * sendBuffer);

// Demonstrates how to check a response for errors.
int checkResponseForErrors(BYTE * recBuffer);

// Demonstrates how to parse the response of ConfigU3.
void parseConfigU3Bytes(BYTE * recBuffer);

int main() {
    // Setup the variables we will need.
    int r = 0; // For checking return values
    HANDLE devHandle = 0;
    BYTE sendBuffer[CONFIGU3_COMMAND_LENGTH], recBuffer[CONFIGU3_RESPONSE_LENGTH];

    // Open the U3
    devHandle = LJUSB_OpenDevice(1, 0, U3_PRODUCT_ID);
    
    if( devHandle == NULL ) {
        printf("Couldn't open U3. Please connect one and try again.\n");
        exit(-1);
    }

    // Builds the ConfigU3 command
    buildConfigU3Bytes(sendBuffer);
    
    // Write the command to the device.
    // LJUSB_Write( handle, sendBuffer, length of sendBuffer )
    r = LJUSB_Write( devHandle, sendBuffer, CONFIGU3_COMMAND_LENGTH );
    
    if( r != CONFIGU3_COMMAND_LENGTH ) {
        printf("An error occurred when trying to write the buffer. The error was: %d\n", errno);
        // *Always* close the device when you error out.
        LJUSB_CloseDevice(devHandle);
        exit(-1);
    }
    
    // Read the result from the device.
    // LJUSB_Read( handle, recBuffer, number of bytes to read)
    r = LJUSB_Read( devHandle, recBuffer, CONFIGU3_RESPONSE_LENGTH );
    
    if( r != CONFIGU3_RESPONSE_LENGTH ) {
        printf("An error occurred when trying to read from the U3. The error was: %d\n", errno);
        LJUSB_CloseDevice(devHandle);
        exit(-1);
    }
    
    // Check the command for errors
    if( checkResponseForErrors(recBuffer) != 0 ){
        LJUSB_CloseDevice(devHandle);
        exit(-1);
    }
    
    // Parse the response into something useful
    parseConfigU3Bytes(recBuffer);
    
    //Close the device.
    LJUSB_CloseDevice(devHandle);
    
    return 0;
}

/* ------------- LabJack Related Helper Functions Definitions ------------- */

// Uses information from section 5.2.2 of the U3 User's Guide to make a ConfigU3
// packet.
// http://labjack.com/support/u3/users-guide/5.2.2
void buildConfigU3Bytes(BYTE * sendBuffer) {
    int i; // For loops
    int checksum = 0;
    
    // Build up the bytes
    //sendBuffer[0] = Checksum8
    sendBuffer[1] = 0xF8;
    sendBuffer[2] = 0x0A;
    sendBuffer[3] = 0x08;
    //sendBuffer[4] = Checksum16 (LSB)
    //sendBuffer[5] = Checksum16 (MSB)
    
    // We just want to read, so we set the WriteMask to zero, and zero out the
    // rest of the bytes.
    sendBuffer[6] = 0;
    for( i = 7; i < CONFIGU3_COMMAND_LENGTH; i++){
        sendBuffer[i] = 0;
    }
    
    // Calculate and set the checksum16
    checksum = calculateChecksum16(sendBuffer, CONFIGU3_COMMAND_LENGTH);
    sendBuffer[4] = (BYTE)( checksum & 0xff );
    sendBuffer[5] = (BYTE)( (checksum / 256) & 0xff );
    
    // Calculate and set the checksum8
    sendBuffer[0] = calculateChecksum8(sendBuffer);
    
    // The bytes have been set, and the checksum calculated. We are ready to
    // write to the U3.
}

// Checks the response for any errors.
int checkResponseForErrors(BYTE * recBuffer) {
    if(recBuffer[0] == 0xB8 && recBuffer[1] == 0xB8) {
        // If the packet is [ 0xB8, 0xB8 ], that's a bad checksum.
        printf("The U3 detected a bad checksum. Double check your checksum calculations and try again.\n");
        return -1;
    }
    else if (recBuffer[1] != 0xF8 || recBuffer[2] != 0x10 || recBuffer[3] != 0x08) {
        // Make sure the command bytes match what we expect.
        printf("Got the wrong command bytes back from the U3.\n");
        return -1;
    }
    
    // Calculate the checksums.
    int checksum16 = calculateChecksum16(recBuffer, CONFIGU3_RESPONSE_LENGTH);
    BYTE checksum8 = calculateChecksum8(recBuffer);
    
    if ( checksum8 != recBuffer[0] || recBuffer[4] != (BYTE)( checksum16 & 0xff ) || recBuffer[5] != (BYTE)( (checksum16 / 256) & 0xff ) ) {
        // Check the checksum
        printf("Response had invalid checksum.\n%d != %d, %d != %d, %d != %d\n", checksum8, recBuffer[0], (BYTE)( checksum16 & 0xff ), recBuffer[4], (BYTE)( (checksum16 / 256) & 0xff ), recBuffer[5] );
        return -1;
    }
    else if ( recBuffer[6] != 0 ) {
        // Check the error code in the packet. See section 5.3 of the U3
        // User's Guide for errorcode descriptions.
        printf("Command returned with an errorcode = %d\n", recBuffer[6]);
        return -1;
    }
    
    return 0;
    
}

// Parses the ConfigU3 packet into something useful.
void parseConfigU3Bytes(BYTE * recBuffer){
    printf("Results of ConfigU3:\n");
    printf("  FirmwareVersion = %d.%02d\n", recBuffer[10], recBuffer[9]);
    printf("  BootloaderVersion = %d.%02d\n", recBuffer[12], recBuffer[11]);
    printf("  HardwareVersion = %d.%02d\n", recBuffer[14], recBuffer[13]);
    printf("  SerialNumber = %d\n", makeInt(recBuffer, 15));
    printf("  ProductID = %d\n", makeShort(recBuffer, 19));
    printf("  LocalID = %d\n", recBuffer[21]);
    printf("  TimerCounterMask = %d\n", recBuffer[22]);
    printf("  FIOAnalog = %d\n", recBuffer[23]);
    printf("  FIODireciton = %d\n", recBuffer[24]);
    printf("  FIOState = %d\n", recBuffer[25]);
    printf("  EIOAnalog = %d\n", recBuffer[26]);
    printf("  EIODirection = %d\n", recBuffer[27]);
    printf("  EIOState = %d\n", recBuffer[28]);
    printf("  CIODirection = %d\n", recBuffer[29]);
    printf("  CIOState = %d\n", recBuffer[30]);
    printf("  DAC1Enable = %d\n", recBuffer[31]);
    printf("  DAC0 = %d\n", recBuffer[32]);
    printf("  DAC1 = %d\n", recBuffer[33]);
    printf("  TimerClockConfig = %d\n", recBuffer[34]);
    printf("  TimerClockDivisor = %d\n", recBuffer[35]);
    printf("  CompatibilityOptions = %d\n", recBuffer[36]);
    printf("  VersionInfo = %d\n", recBuffer[37]);
    
    if( recBuffer[37] == 0 ){
        printf("  DeviceName = U3A\n");
    }
    else if(recBuffer[37] == 1) {
        printf("  DeviceName = U3B\n");
    }
    else if(recBuffer[37] == 2) {
        printf("  DeviceName = U3-LV\n");
    }
    else if(recBuffer[37] == 18) {
        printf("  DeviceName = U3-HV\n");
    }
    
}


/* ---------------- Buffer Helper Functions Definitions ---------------- */

// Takes a buffer and an offset, and turns into an 32-bit integer
int makeInt(BYTE * buffer, int offset){
    return (buffer[offset+3] << 24) + (buffer[offset+2] << 16) + (buffer[offset+1] << 8) + buffer[offset];
}

// Takes a buffer and an offset, and turns into an 16-bit integer
int makeShort(BYTE * buffer, int offset) {
    return (buffer[offset+1] << 8) + buffer[offset];
}

// Calculates the checksum8
BYTE calculateChecksum8(BYTE* buffer){
    int i; // For loops
    int temp; // For holding a value while we working.
    int checksum = 0;
    
    for( i = 1; i < 6; i++){
        checksum += buffer[i];
    }
    
    temp = checksum/256;
    checksum = ( checksum - 256 * temp ) + temp;
    temp = checksum/256;
    
    return (BYTE)( ( checksum - 256 * temp ) + temp );
}

// Calculates the checksum16
int calculateChecksum16(BYTE* buffer, int len){
    int i;
    int checksum = 0;
    
    for( i = 6; i < len; i++){
        checksum += buffer[i];
    }
    
    return checksum;
}
