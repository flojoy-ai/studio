/*
An example that shows a minimal use of Exodriver without the use of functions
hidden in header files.

You can compile this example with the following command:
  $ g++ -lm -llabjackusb ue9BasicCommConfig.c

It is also included in the Makefile.
*/

/* Includes */
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include "labjackusb.h"

// Defines how long the command is
#define COMMCONFIG_COMMAND_LENGTH 38

// Defines how long the response is
#define COMMCONFIG_RESPONSE_LENGTH 38

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

// Demonstrates how to build the CommConfig packet.
void buildCommConfigBytes(BYTE * sendBuffer);

// Demonstrates how to check a response for errors.
int checkResponseForErrors(BYTE * recBuffer);

// Demonstrates how to parse the response of CommConfig.
void parseCommConfigBytes(BYTE * recBuffer);

int main() {
    // Setup the variables we will need.
    int r = 0; // For checking return values
    HANDLE devHandle = 0;
    BYTE sendBuffer[COMMCONFIG_COMMAND_LENGTH], recBuffer[COMMCONFIG_RESPONSE_LENGTH];

    // Open the UE9
    devHandle = LJUSB_OpenDevice(1, 0, UE9_PRODUCT_ID);
    
    if( devHandle == NULL ) {
        printf("Couldn't open UE9. Please connect one and try again.\n");
        exit(-1);
    }

    // Builds the CommConfig command
    buildCommConfigBytes(sendBuffer);
    
    // Write the command to the device.
    // LJUSB_Write( handle, sendBuffer, length of sendBuffer )
    r = LJUSB_Write( devHandle, sendBuffer, COMMCONFIG_COMMAND_LENGTH );
    
    if( r != COMMCONFIG_COMMAND_LENGTH ) {
        printf("An error occurred when trying to write the buffer. The error was: %d\n", errno);
        // *Always* close the device when you error out.
        LJUSB_CloseDevice(devHandle);
        exit(-1);
    }
    
    // Read the result from the device.
    // LJUSB_Read( handle, recBuffer, number of bytes to read)
    r = LJUSB_Read( devHandle, recBuffer, COMMCONFIG_RESPONSE_LENGTH );
    
    if( r != COMMCONFIG_RESPONSE_LENGTH ) {
        printf("An error occurred when trying to read from the UE9. The error was: %d\n", errno);
        LJUSB_CloseDevice(devHandle);
        exit(-1);
    }
    
    // Check the command for errors
    if( checkResponseForErrors(recBuffer) != 0 ){
        LJUSB_CloseDevice(devHandle);
        exit(-1);
    }
    
    // Parse the response into something useful
    parseCommConfigBytes(recBuffer);
    
    //Close the device.
    LJUSB_CloseDevice(devHandle);
    
    return 0;
}

/* ------------- LabJack Related Helper Functions Definitions ------------- */

// Uses information from section 5.2.1 of the UE9 User's Guide to make a CommConfig
// packet.
// http://labjack.com/support/ue9/users-guide/5.2.1
void buildCommConfigBytes(BYTE * sendBuffer) {
    int i; // For loops
    int checksum = 0;
    
    // Build up the bytes
    //sendBuffer[0] = Checksum8
    sendBuffer[1] = 0x78;
    sendBuffer[2] = 0x10;
    sendBuffer[3] = 0x01;
    //sendBuffer[4] = Checksum16 (LSB)
    //sendBuffer[5] = Checksum16 (MSB)
    
    // We just want to read, so we set the WriteMask to zero, and zero out the
    // rest of the bytes.
    sendBuffer[6] = 0;
    for( i = 7; i < COMMCONFIG_COMMAND_LENGTH; i++){
        sendBuffer[i] = 0;
    }
    
    // Calculate and set the checksum16
    checksum = calculateChecksum16(sendBuffer, COMMCONFIG_COMMAND_LENGTH);
    sendBuffer[4] = (BYTE)( checksum & 0xff );
    sendBuffer[5] = (BYTE)( (checksum / 256) & 0xff );
    
    // Calculate and set the checksum8
    sendBuffer[0] = calculateChecksum8(sendBuffer);
    
    // The bytes have been set, and the checksum calculated. We are ready to
    // write to the UE9.
}

// Checks the response for any errors.
int checkResponseForErrors(BYTE * recBuffer) {
    if(recBuffer[0] == 0xB8 && recBuffer[1] == 0xB8) {
        // If the packet is [ 0xB8, 0xB8 ], that's a bad checksum.
        printf("The UE9 detected a bad checksum. Double check your checksum calculations and try again.\n");
        return -1;
    }
    else if (recBuffer[1] != 0x78 || recBuffer[2] != 0x10 || recBuffer[3] != 0x01) {
        // Make sure the command bytes match what we expect.
        printf("Got the wrong command bytes back from the UE9.\n");
        return -1;
    }
    // Normally, we would check byte 6 for errorcodes. CommConfig is an
    // exception to that rule.
    
    // Calculate the checksums.
    int checksum16 = calculateChecksum16(recBuffer, COMMCONFIG_RESPONSE_LENGTH);
    BYTE checksum8 = calculateChecksum8(recBuffer);
    
    if ( checksum8 != recBuffer[0] || recBuffer[4] != (BYTE)( checksum16 & 0xff ) || recBuffer[5] != (BYTE)( (checksum16 / 256) & 0xff ) ) {
        // Check the checksum
        printf("Response had invalid checksum.\n%d != %d, %d != %d, %d != %d\n", checksum8, recBuffer[0], (BYTE)( checksum16 & 0xff ), recBuffer[4], (BYTE)( (checksum16 / 256) & 0xff ), recBuffer[5] );
        return -1;
    }
    
    return 0;
    
}

// Parses the CommConfig packet into something useful.
void parseCommConfigBytes(BYTE * recBuffer){
    printf("Results of CommConfig:\n");
    printf("  LocalID = %d\n", recBuffer[8]);
    printf("  PowerLevel = %d\n", recBuffer[9]);
    printf("  IPAddress = %d.%d.%d.%d\n", recBuffer[13], recBuffer[12], recBuffer[11], recBuffer[10] );
    printf("  Gateway = %d.%d.%d.%d\n", recBuffer[17], recBuffer[16], recBuffer[15], recBuffer[14] );
    printf("  Subnet = %d.%d.%d.%d\n", recBuffer[21], recBuffer[20], recBuffer[19], recBuffer[18] );
    printf("  PortA = %d\n", makeShort(recBuffer, 22));
    printf("  PortB = %d\n", makeShort(recBuffer, 24));
    printf("  DHCPEnabled = %d\n", recBuffer[26]);
    printf("  ProductID = %d\n", recBuffer[27]);
    printf("  MACAddress = %02X:%02X:%02X:%02X:%02X:%02X\n", recBuffer[33], recBuffer[32], recBuffer[31], recBuffer[30], recBuffer[29], recBuffer[28]);
    
    BYTE serialBytes[4];
    serialBytes[0] = recBuffer[28];
    serialBytes[1] = recBuffer[29];
    serialBytes[2] = recBuffer[30];
    serialBytes[3] = 0x10;
    printf("  SerialNumber = %d\n", makeInt(serialBytes, 0));
    
    printf("  HardwareVersion = %d.%02d\n", recBuffer[35], recBuffer[34]);
    printf("  FirmwareVersion = %d.%02d\n", recBuffer[37], recBuffer[36]);
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
