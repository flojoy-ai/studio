#
# Makefile for Modbus examples
#
TESTMODBUS_SRC=testModbusFunctions.c modbus.c
TESTMODBUS_OBJ=$(TESTMODBUS_SRC:.c=.o)

READMODBUS_SRC=readModbusExample.c modbus.c
READMODBUS_OBJ=$(READMODBUS_SRC:.c=.o)

WRITEMODBUS_SRC=writeModbusExample.c modbus.c
WRITEMODBUS_OBJ=$(WRITEMODBUS_SRC:.c=.o)

CFLAGS+=-Wall -g
LIBS=-lm -llabjackusb

all: testModbusFunctions readModbusExample writeModbusExample

testModbusFunctions: $(TESTMODBUS_OBJ)
	$(CC) -o testModbusFunctions $(TESTMODBUS_OBJ) $(LDFLAGS) $(LIBS)
	
readModbusExample: $(READMODBUS_OBJ)
	$(CC) -o readModbusExample $(READMODBUS_OBJ) $(LDFLAGS) $(LIBS)
	
writeModbusExample: $(WRITEMODBUS_OBJ)
	$(CC) -o writeModbusExample $(WRITEMODBUS_OBJ) $(LDFLAGS) $(LIBS)

clean:
	rm -f *.o *~ testModbusFunctions readModbusExample writeModbusExample
