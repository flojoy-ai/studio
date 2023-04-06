/* 
 * This file shows how to uses the functions in modbus.h without requiring a
 * LabJack, the Exodriver, or libusb.
 */
#include <stdio.h>
#include "modbus.h"

int main() {
    int i;
    
    printf("Modbus Function tests:\n\n");
    
    // Build a packet to read register 0 (AIN0) and store it in sendBuffer
    unsigned char sendBuffer[14];
    int startReg = 0; // Start at register 0
    int numRegs = 2; // AIN0 is floating point, so need to read 2 registers
    int unitId = 0; // For UD family devices, always 0
    int prependZeros = 1; // For UD family devices on USB, always 1
    int numBytesToRead;
    
    numBytesToRead = buildReadHoldingRegistersPacket( sendBuffer, startReg, numRegs, unitId, prependZeros );
    
    printf("buildReadHoldingRegistersPacket:\n  sendBuffer: [");
    for(i = 0; i < 13; i++) {
        printf("0x%X, ", sendBuffer[i]);
    }
    printf("0x%X]\n  numBytesToRead: %d\n\n", sendBuffer[13], numBytesToRead);
    
    
    // Parse a float from a byte array.
    unsigned char recBuffer[] = { 0x40, 0x0, 0x0, 0x0 };
    float fValue = parseFPRegisterResponse(recBuffer, 0);
    
    printf("parseFPRegister: [0x40, 0x0, 0x0, 0x0] => %f\n\n", fValue);
    
    // Parse an int from a byte array.
    recBuffer[0] = 0x0;
    recBuffer[1] = 0x84;
    recBuffer[2] = 0x5F;
    recBuffer[3] = 0xED;
    int iValue = parseIntRegisterResponse(recBuffer, 0);
    printf("parseIntRegister: [0x0, 0x84, 0x5F, 0xED] => %i\n\n", iValue);
    
    // Parse a short from a byte array.
    recBuffer[0] = 0x2;
    recBuffer[1] = 0x10;
    short sValue = parseShortRegisterResponse(recBuffer, 0);
    printf("parseShortRegister: [0x2, 0x10] => %i\n\n", sValue);
    
    
    // Start Write Functions
    
    // Build an array of bytes to write 2.0, 8675309, and 528 starting at 0
    startReg = 0; // Start at register 0
    numRegs = 5; // 1 float (2 registers), 1 int (2 registers), 1 short (1 reg)
    unitId = 0; // For UD family devices, always 0
    prependZeros = 1; // For UD family devices on USB, always 1
    unsigned char writeBuffer[25]; // 13 + (2*5) + 2 = 25
    
    numBytesToRead = buildWriteHoldingRegistersPacket(writeBuffer, startReg, numRegs, unitId, prependZeros);
    printf("buildWriteHoldingRegistersPacket:\n  writeBuffer: [");
    for(i = 0; i < 24; i++) {
        printf("0x%X, ", writeBuffer[i]);
    }
    printf("0x%X]\n  numBytesToRead: %d\n\n", writeBuffer[24], numBytesToRead);
    
    putFPIntoBuffer(writeBuffer, 15, 2.0);
    printf("putFPIntoBuffer: Appended 2.0 to packet.\n\n");
    
    putIntIntoBuffer(writeBuffer, 19, 8675309);
    printf("putIntIntoBuffer: Appended 8675309 to packet.\n\n");
    
    putShortIntoBuffer(writeBuffer, 23, 528);
    printf("putShortIntoBuffer: Appended 528 to packet.\n\n");
    
    printf("Result:\n  writeBuffer: [");
    for(i = 0; i < 24; i++) {
        printf("0x%X, ", writeBuffer[i]);
    }
    printf("0x%X]\n\n", writeBuffer[24]);
    
    return 0;
}