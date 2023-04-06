/*
* A library to help you build modbus functions for LabJack devices.
*/

/* --------- Static Variables --------- */

static short nextTransactionId = 0x37;

/* --------- Read Functions --------- */

int buildReadHoldingRegistersPacket( unsigned char* sendBuffer, int startReg, int numRegs, int unitId, int prependZeros ) {
    int offset = 0;
    
    if(prependZeros != 0){
        sendBuffer[0] = 0;
        sendBuffer[1] = 0;
        offset = 2;
    }
    
	// Bytes 0 and 1 are TransID
	sendBuffer[0+offset] = (unsigned char)((nextTransactionId >> 8) & 0xff);
	sendBuffer[1+offset] = (unsigned char)(nextTransactionId & 0xff);
	nextTransactionId++;
	
	// Bytes 2 and 3 are ProtocolID, set to 0
	sendBuffer[2+offset] = 0;
	sendBuffer[3+offset] = 0;
	
	// Bytes 4 and 5 are length.
	sendBuffer[4+offset] = 0;
	sendBuffer[5+offset] = 6;
	
	// Byte 6 is Unit ID.
	sendBuffer[6+offset] = unitId;
	
	// Byte 7 is Read Holding Registers ( function # 3 )
	sendBuffer[7+offset] = 3;
	
	// Bytes 8 and 9 are Address
	sendBuffer[8+offset] = (unsigned char)((startReg >> 8) & 0xff);
	sendBuffer[9+offset] = (unsigned char)(startReg & 0xff);
	
	//Bytes 10 and 11 are NumRegs
	sendBuffer[10+offset] = (unsigned char)((numRegs >> 8) & 0xff);
	sendBuffer[11+offset] = (unsigned char)(numRegs & 0xff);
	
	return 9+(numRegs*2);

}

float parseFPRegisterResponse(unsigned char* recBuffer, int offset) {
    unsigned char fBuffer[4];
    float* fPointer;
    
    fBuffer[0] = recBuffer[offset + 3];
    fBuffer[1] = recBuffer[offset + 2];
    fBuffer[2] = recBuffer[offset + 1];
    fBuffer[3] = recBuffer[offset];
    
    fPointer = (float*)fBuffer;
    
    return *fPointer;
}

int parseIntRegisterResponse(unsigned char* recBuffer, int offset) {
    unsigned char iBuffer[4];
    int* iPointer;
    
    iBuffer[0] = recBuffer[offset + 3];
    iBuffer[1] = recBuffer[offset + 2];
    iBuffer[2] = recBuffer[offset + 1];
    iBuffer[3] = recBuffer[offset];
    
    iPointer = (int*)iBuffer;
    
    return *iPointer;
}

short parseShortRegisterResponse(unsigned char* recBuffer, int offset) {
    unsigned char sBuffer[4];
    short* sPointer;
    
    sBuffer[0] = recBuffer[offset + 1];
    sBuffer[1] = recBuffer[offset];
    
    sPointer = (short*)sBuffer;
    
    return *sPointer;
}

int buildWriteHoldingRegistersPacket(unsigned char* sendBuffer, int startReg, int numRegs, int unitId, int prependZeros) {
    int offset = 0;
    
    if(prependZeros != 0){
        sendBuffer[0] = 0;
        sendBuffer[1] = 0;
        offset = 2;
    }
    
	// Bytes 0 and 1 are TransID
	sendBuffer[0+offset] = (unsigned char)((nextTransactionId >> 8) & 0xff);
	sendBuffer[1+offset] = (unsigned char)(nextTransactionId & 0xff);
	nextTransactionId++;
	
	// Bytes 2 and 3 are ProtocolID, set to 0
	sendBuffer[2+offset] = 0;
	sendBuffer[3+offset] = 0;
	
	// Bytes 4 and 5 are length.
	sendBuffer[4+offset] = 0;
	sendBuffer[5+offset] = 7 + (numRegs * 2);
	
	// Byte 6 is Unit ID.
	sendBuffer[6+offset] = unitId;
	
	// Byte 7 is Read Holding Registers ( function # 3 )
	sendBuffer[7+offset] = 16;
	
	// Bytes 8 and 9 are Address
	sendBuffer[8+offset] = (unsigned char)((startReg >> 8) & 0xff);
	sendBuffer[9+offset] = (unsigned char)(startReg & 0xff);
	
	// Bytes 10 and 11 are NumRegs
	sendBuffer[10+offset] = (unsigned char)((numRegs >> 8) & 0xff);
	sendBuffer[11+offset] = (unsigned char)(numRegs & 0xff);
	
	// Byte 12 is Byte Count, or 2 * numReg
	sendBuffer[12+offset] = (unsigned char)((numRegs * 2) & 0xff);
	
	// The rest of the bytes are up to the user.
	
	return 12; // Write Registers always return 12 bytes.
    
}

int putFPIntoBuffer( unsigned char* sendBuffer, int offset, float value) {
    unsigned char* bPointer;
    
    bPointer = (unsigned char*)&value;
    
    sendBuffer[offset] = bPointer[3];
    sendBuffer[offset+1] = bPointer[2];
    sendBuffer[offset+2] = bPointer[1];
    sendBuffer[offset+3] = bPointer[0];
    
    return 0;
}

int putIntIntoBuffer( unsigned char* sendBuffer, int offset, int value ) {
    unsigned char* bPointer;
    
    bPointer = (unsigned char*)&value;
    
    sendBuffer[offset] = bPointer[3];
    sendBuffer[offset+1] = bPointer[2];
    sendBuffer[offset+2] = bPointer[1];
    sendBuffer[offset+3] = bPointer[0];
    
    return 0;
}

int putShortIntoBuffer( unsigned char* sendBuffer, int offset, short value ) {
    unsigned char* bPointer;
    
    bPointer = (unsigned char*)&value;
    
    sendBuffer[offset] = bPointer[1];
    sendBuffer[offset+1] = bPointer[0];
    
    return 0;
}