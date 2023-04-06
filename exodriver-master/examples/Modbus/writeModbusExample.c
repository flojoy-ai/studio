/*
 * A simple example that shows how to used modbus.h with the Exodriver by
 * writing 2.0 to DAC0.
 *
 * The most important thing to get right are your buffer lengths. With write 
 * register, it can be a little tricky. The base packet is 13 bytes, then 2 
 * extra bytes for every register you're going to write to. Because of a weird
 * quirk with LabJacks, you need to prepend two bytes of zeros. This makes the
 * equation as follows: send buffer length = 2 + 13 + (2 * number of registers).
 *
 * The response is always 12 bytes, so that part is easy.
 *
 * Another possible point of confusion with writing is that you have to setup
 * the basic bytes with buildWriteHoldingRegistersPacket then insert the values
 * with put*IntoBuffer functions. Your first value should always go in offset
 * 15. If you are putting multiple values in one packet, the offset of the 
 * second value will depend on the type of the first value. Floats and Integers
 * will both take 4 bytes, and Shorts will only take 2. So, if you are writing a
 * Float then a Short, the Float will go in offset 15, the Short in offset 19.
 * If it's a Short than a Float, the Short will have offset 15, and the Float
 * should be put in offset 17.
 *
 * For more information about Modbus, please see the support page:
 * http://labjack.com/support/modbus
 */

#include <stdio.h>
#include "modbus.h"
#include "labjackusb.h"

// Set to 3 (U3), 6 (U6), or 9 (UE9).
#define DEVICE_TYPE 3

// Set to what you want the DAC to output.
#define DAC_VALUE 2.0f

// 13 + (2*numReg) + 2 = 13 + (2*2) + 2 = 19
#define WRITE_REGISTER_SEND_LENGTH 19

// Write Holding Register Response Packets are always 12 bytes
#define WRITE_REGISTER_REC_LENGTH 12

int main() {
    HANDLE devHandle;
    int i;
    int r = 0; // For checking return values
    
    int startReg = 5000; // Start at register 5000
    int numRegs = 2; // DAC0 is floating point, so need to write 2 registers
    int unitId = 0; // For UD family devices, always 0
    int prependZeros = 1; // For UD family devices on USB, always 1
    int numBytesToRead = WRITE_REGISTER_REC_LENGTH;
    BYTE sendBuffer[WRITE_REGISTER_SEND_LENGTH];
    BYTE recBuffer[WRITE_REGISTER_REC_LENGTH]; // Same as numBytesToRead
    
    // Open the device
    devHandle = LJUSB_OpenDevice(1, 0, DEVICE_TYPE);
    
    if(devHandle <= 0){
        printf("ERROR: Couldn't find a LabJack to open.");
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
    numBytesToRead = buildWriteHoldingRegistersPacket(sendBuffer, startReg, numRegs, unitId, prependZeros);
    
    printf("Built Write Holding Registers Packet to write register 5000 (DAC0).\n");
    
    // Puts DAC_VALUE into the buffer.
    putFPIntoBuffer(sendBuffer, 15, DAC_VALUE);
    
    printf("Added value %.2f to buffer.\n", DAC_VALUE);
    
    // Send packet to the device.
    r = LJUSB_Write(devHandle, sendBuffer, WRITE_REGISTER_SEND_LENGTH);
    
    if( r != WRITE_REGISTER_SEND_LENGTH ){
        printf("ERROR: An error occurred while writing to the device.");
        LJUSB_CloseDevice(devHandle);
        return -1;
    }
    
    printf("Wrote command to device.\n");
    
    printf("Sent = [");
    for( i = 0; i < WRITE_REGISTER_SEND_LENGTH-1; i++){
        printf("0x%X, ", sendBuffer[i]);
    }
    printf("0x%X]\n\n", sendBuffer[WRITE_REGISTER_SEND_LENGTH-1]);
    
    // Read the response from the device.
    r = LJUSB_Read(devHandle, recBuffer, numBytesToRead);
    
    if( r != numBytesToRead ){
        printf("ERROR: An error occurred while reading from the device.\n  r = %i", r);
        LJUSB_CloseDevice(devHandle);
        return -1;
    }
    
    printf("Read the response.\n");
    
    printf("Read = [");
    for( i = 0; i < numBytesToRead-1; i++){
        printf("0x%X, ", recBuffer[i]);
    }
    printf("0x%X]\n\n", recBuffer[numBytesToRead-1]);
    
    // Close the device.
    LJUSB_CloseDevice(devHandle);
    
    printf("Closed Device.\n");
    
    return 0;
}