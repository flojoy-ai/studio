/*
 * A simple example that shows how to used modbus.h with the Exodriver by
 * reading AIN0 and printing it to stdout.
 *
 * The most important thing to get right are your buffer lengths. In the case of 
 * read register, it's easy. The command to be written is always 14 bytes. The
 * response is 9 + (2 * number of registers being read). So, if you are reading
 * three registers, your receive buffer needs to be 9 + (3 * 2), or 15 bytes.
 * What those bytes mean will depend on the register. Make sure to check out the
 * Modbus support page:
 * http://labjack.com/support/modbus
 */

#include <stdio.h>
#include "modbus.h"
#include "labjackusb.h"

// Set to 3 (U3), 6 (U6), or 9 (UE9).
#define DEVICE_TYPE 3

// Read Holding Register Packets are always 14 bytes over USB
#define READ_REGISTER_SEND_LENGTH 14

int main() {
    HANDLE devHandle;
    int i;
    int r = 0; // For checking return values
    
    int startReg = 0; // Start at register 0
    int numRegs = 2; // AIN0 is floating point, so need to read 2 registers
    int unitId = 0; // For UD family devices, always 0
    int prependZeros = 1; // For UD family devices on USB, always 1
    BYTE sendBuffer[READ_REGISTER_SEND_LENGTH]; // 2 (for extra zeros) + 12
    int numBytesToRead = 13; // 9 + (2*numReg)
    BYTE recBuffer[13]; // Same as numBytesToRead
    float value; // Will hold parsed result
    
    // Open the device
    devHandle = LJUSB_OpenDevice(1, 0, DEVICE_TYPE);
    
    if(devHandle <= 0){
        printf("ERROR: Couldn't find a LabJack to open.\n");
        return -1;
    }
    
    if(DEVICE_TYPE == 3){
        printf("Opened first found U3.\n");
    }
    else if(DEVICE_TYPE == 6) {
        printf("Opened first found U6.\n");
    }
    else {
        printf("Opened first found UE9.\n");
    }
    
    // Build the packet.
    numBytesToRead = buildReadHoldingRegistersPacket(sendBuffer, startReg, numRegs, unitId, prependZeros);
    
    printf("Built Read Holding Registers Packet to read register 0 (AIN0).\n");
    
    // Send packet to the device.
    r = LJUSB_Write(devHandle, sendBuffer, READ_REGISTER_SEND_LENGTH);
    
    if( r != READ_REGISTER_SEND_LENGTH ){
        printf("ERROR: An error occurred while writing to the device.");
        LJUSB_CloseDevice(devHandle);
        return -1;
    }
    
    printf("Wrote command to device.\n");
    
    printf("Sent = [");
    for( i = 0; i < READ_REGISTER_SEND_LENGTH-1; i++){
        printf("0x%X, ", sendBuffer[i]);
    }
    printf("0x%X]\n\n", sendBuffer[READ_REGISTER_SEND_LENGTH-1]);
    
    // Read the response from the device.
    r = LJUSB_Read(devHandle, recBuffer, numBytesToRead);
    
    if( r != numBytesToRead ){
        printf("ERROR: An error occurred while reading from the device.");
        LJUSB_CloseDevice(devHandle);
        return -1;
    }
    
    printf("Read the response.\n");
    
    printf("Read = [");
    for( i = 0; i < numBytesToRead-1; i++){
        printf("0x%X, ", recBuffer[i]);
    }
    printf("0x%X]\n\n", recBuffer[numBytesToRead-1]);
    
    // Parse out the value.
    value = parseFPRegisterResponse(recBuffer, 9);
    printf("AIN0: %f\n\n", value);
    
    // Close the device.
    LJUSB_CloseDevice(devHandle);
    
    printf("Closed Device.\n");
    
    return 0;
}