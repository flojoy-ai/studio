/*
 * A library to help you build Modbus functions for LabJack devices. For more 
 * information on Modbus, please see:
 *
 * http://labjack.com/support/modbus
 *
 * The flow for working with a LabJack device should go like this:
 *   1. Open the device (LJUSB_OpenDevice)
 *   2. Build the packet to write using buildReadHoldingRegistersPacket
 *   3. Write the packet to the device (LJUSB_Write)
 *   4. Read the result (LJUSB_Read)
 *   5. Parse the result using a parse*RegisterResponse function
 *   6. Close the device (LJUSB_CloseDevice)
 *
 * For writing to registers, the flow goes like this:
 *   1. Open the device (LJUSB_OpenDevice)
 *   2. Build the packet to write using buildWriteHoldingRegistersPacket
 *   3. Insert the values to write to packet with put*ToBuffer functions
 *   4. Write the packet to the device (LJUSB_Write)
 *   5. Read the result (LJUSB_Read)
 *   6. Close the device (LJUSB_CloseDevice)
 */

#ifndef _MODBUS_H_
#define _MODBUS_H_

#ifdef __cplusplus
extern "C"{
#endif

/* --------- Read Functions --------- */

int buildReadHoldingRegistersPacket( unsigned char* sendBuffer, int startReg, int numRegs, int unitId, int prependZeros );
/* buildReadHoldingRegistersPacket takes a byte array and sets the bytes to be a
 * Modbus packet to read a register. It returns the number of bytes to read.
 * 
 * Args:
 * - sendBuffer: an array of length 12 or 14 (if prependZeros != 0 )
 * - startReg: The starting register.
 * - numReg: The number of registers to read starting at startReg.
 * - unitId: For U3/U6/UE9, always pass 0.
 * - prependZeros: If this packet is going to be sent over USB, the UD family of
 *                 devices require that the Modbus packet start with 2 extra
 *                 bytes of zeros.
 *
 * Example Usage to read register 0 (AIN0):
unsigned char sendBuffer[14];
int startReg = 0; // Start at register 0
int numRegs = 2; // AIN0 is a floating point value, so need to read 2 registers
int unitId = 0; // For UD family devices, always 0
int prependZeros = 1; // For UD family devices on USB, always 1
int numBytesToRead;
 
numBytesToRead = buildReadHoldingRegistersPacket(
                    sendBuffer, startReg, numRegs, unitId, prependZeros );
 */

float parseFPRegisterResponse(unsigned char* recBuffer, int offset);
/*
 * parseFPRegisterResponse takes the recBuffer and an offset, and returns the 
 * floating point value. recBuffer must have a length equal to offset+3.
 *
 * Args:
 * - recBuffer: the buffer that was read from the device.
 * - offset: the offset to start reading from. Usually, 9.
 *
 * Example Usage:
unsigned char recBuffer = { 0x40, 0x0, 0x0, 0x0 };
float value = parseFPRegisterResponse(recBuffer, 0);
// value -> 2.0
 */
 
int parseIntRegisterResponse(unsigned char* recBuffer, int offset);
/*
 * parseIntRegisterResponse takes the recBuffer and an offset, and returns the 
 * integer value. recBuffer must have a length equal to offset+4.
 *
 * Args:
 * - recBuffer: the buffer that was read from the device.
 * - offset: the offset to start reading from. Usually, 9.
 *
 * Example Usage:
unsigned char recBuffer = { 0x0, 0x84, 0x5F, 0xED };
int value = parseIntRegisterResponse(recBuffer, 0);
// value -> 8675309
 */

short parseShortRegisterResponse(unsigned char* recBuffer, int offset);
/*
 * parseShortRegisterResponse takes the recBuffer and an offset, and returns the 
 * short value. recBuffer must have a length equal to offset+2.
 *
 * Args:
 * - recBuffer: the buffer that was read from the device.
 * - offset: the offset to start reading from. Usually, 9.
 *
 * Example Usage:
unsigned char recBuffer = { 0x2, 0x10 };
short value = parseShortRegisterResponse(recBuffer, 0);
// value -> 528
 */

/* --------- Write Functions --------- */

int buildWriteHoldingRegistersPacket(unsigned char* sendBuffer, int startReg, int numReg, int unitId, int prependZeros);
/* buildReadHoldingRegistersPacket takes a byte array and sets the bytes to be a
 * Modbus packet to write registers. It returns the number of bytes to read.
 * After calling this function, you must use the put*ToBuffer functions to set
 * the values on the end.
 * 
 * Args:
 * - sendBuffer: an array of length 13+(2*numReg) (+2 if prependZeros != 0 )
 * - startReg: The starting register.
 * - numReg: The number of registers to write starting at startReg.
 * - unitId: For U3/U6/UE9, always pass 0.
 * - prependZeros: If this packet is going to be sent over USB, the UD family of
 *                 devices require that the Modbus packet start with 2 extra
 *                 bytes of zeros.
 *
 * Example Usage to write 2.0 to register 5000 (DAC0):
int startReg = 0; // Start at register 0
int numRegs = 2; // DAC0 is a floating point value, so need to read 2 registers
int unitId = 0; // For UD family devices, always 0
int prependZeros = 1; // For UD family devices on USB, always 1
unsigned char sendBuffer[19]; // 13 + (2*2) + 2 = 19
int numBytesToRead;
 
numBytesToRead = buildWriteHoldingRegistersPacket(
                    sendBuffer, startReg, numRegs, unitId, prependZeros );
putFPIntoBuffer(sendBuffer, 15, 2.0);
//sendBuffer => [0x0, 0x0, 0x0, 0x38, 0x0, 0x0, 0x0, 0xB, 0x0, 0x10, 0x0, 0x0,
//               0x0, 0x2, 0x4, 0x40, 0x0, 0x0, 0x0]
 */

int putFPIntoBuffer( unsigned char* sendBuffer, int offset, float value);
/*
 * putFPIntoBuffer writes the bytes of value into sendBuffer at offset. 
 * sendBuffer must have a length equal to offset+4. Returns zero for success.
 *
 * Args:
 * - sendBuffer: the buffer to be written to the device.
 * - offset: the offset to start overwriting. Usually, 15.
 * - value: a float of the value to write.
 *
 * Example Usage:
unsigned char sendBuffer[4];
putFPIntoBuffer(sendBuffer, 0, 2.0);
// sendBuffer -> [0x40, 0x0, 0x0, 0x0]
 */

int putIntIntoBuffer( unsigned char* sendBuffer, int offset, int value );
/*
 * putIntIntoBuffer writes the bytes of value into sendBuffer at offset. 
 * sendBuffer must have a length equal to offset+4. Returns zero for success.
 *
 * Args:
 * - sendBuffer: the buffer to be written to the device.
 * - offset: the offset to start overwriting. Usually, 15.
 * - value: an int of the value to write.
 *
 * Example Usage:
unsigned char sendBuffer[4];
putIntIntoBuffer(sendBuffer, 0, 8675309);
// sendBuffer -> [0x0, 0x84, 0x5F, 0xED]
 */

int putShortIntoBuffer( unsigned char* sendBuffer, int offset, short value );
/*
 * putShortIntoBuffer inserts the bytes of value into sendBuffer at offset. 
 * sendBuffer must have a length equal to offset+2. Returns zero for success.
 *
 * Args:
 * - sendBuffer: the buffer to be written to the device.
 * - offset: the offset to start overwriting. Usually, 15.
 * - value: an int of the value to write.
 *
 * Example Usage:
unsigned char sendBuffer[2];
putShortIntoBuffer(sendBuffer, 0, (short)528);
// sendBuffer -> [0x2, 0x10]
 */

#ifdef __cplusplus
}
#endif

#endif // _MODBUS_H_
