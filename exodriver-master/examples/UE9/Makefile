#
# Makefile for UE9 examples
#
UE9SINGLEIO_SRC=ue9SingleIO.c ue9.c
UE9SINGLEIO_OBJ=$(UE9SINGLEIO_SRC:.c=.o)

UE9COMMCONFIG_SRC=ue9BasicCommConfig.c
UE9COMMCONFIG_OBJ=$(UE9COMMCONFIG_SRC:.c=.o)

UE9ETHERNET_SRC=ue9EthernetExample.c
UE9ETHERNET_OBJ=$(UE9ETHERNET_SRC:.c=.o)

UE9CONTROLCONFIG_SRC=ue9ControlConfig.c ue9.c
UE9CONTROLCONFIG_OBJ=$(UE9CONTROLCONFIG_SRC:.c=.o)

UE9FEEDBACK_SRC=ue9Feedback.c ue9.c
UE9FEEDBACK_OBJ=$(UE9FEEDBACK_SRC:.c=.o)

UE9STREAM_SRC=ue9Stream.c ue9.c
UE9STREAM_OBJ=$(UE9STREAM_SRC:.c=.o)

UE9TIMERCOUNTER_SRC=ue9TimerCounter.c ue9.c
UE9TIMERCOUNTER_OBJ=$(UE9TIMERCOUNTER_SRC:.c=.o)

UE9ALLIO_SRC=ue9allio.c ue9.c
UE9ALLIO_OBJ=$(UE9ALLIO_SRC:.c=.o)

UE9EFUNCTIONS_SRC=ue9EFunctions.c ue9.c
UE9EFUNCTIONS_OBJ=$(UE9EFUNCTIONS_SRC:.c=.o)

UE9LJTDAC_SRC=ue9LJTDAC.c ue9.c
UE9LJTDAC_OBJ=$(UE9LJTDAC_SRC:.c=.o)

SRCS=$(wildcard *.c)
HDRS=$(wildcard *.h)

CFLAGS +=-Wall -g
LIBS=-lm -llabjackusb

all: ue9BasicCommConfig ue9EthernetExample ue9SingleIO ue9ControlConfig ue9Feedback ue9Stream ue9TimerCounter ue9allio ue9EFunctions ue9LJTDAC

ue9BasicCommConfig: $(UE9COMMCONFIG_OBJ) $(HDRS)
	$(CC) -o ue9BasicCommConfig $(UE9COMMCONFIG_OBJ) $(LDFLAGS) $(LIBS)

ue9EthernetExample: $(UE9ETHERNET_OBJ) $(HDRS)
	$(CC) -o ue9EthernetExample $(UE9ETHERNET_OBJ) $(LDFLAGS) $(LIBS)

ue9SingleIO: $(UE9SINGLEIO_OBJ) $(HDRS)
	$(CC) -o ue9SingleIO $(UE9SINGLEIO_OBJ) $(LDFLAGS) $(LIBS)

ue9ControlConfig: $(UE9CONTROLCONFIG_OBJ) $(HDRS)
	$(CC) -o ue9ControlConfig $(UE9CONTROLCONFIG_OBJ) $(LDFLAGS) $(LIBS)

ue9Feedback: $(UE9FEEDBACK_OBJ) $(HDRS)
	$(CC) -o ue9Feedback $(UE9FEEDBACK_OBJ) $(LDFLAGS) $(LIBS)

ue9Stream: $(UE9STREAM_OBJ) $(HDRS)
	$(CC) -o ue9Stream $(UE9STREAM_OBJ) $(LDFLAGS) $(LIBS)

ue9TimerCounter: $(UE9TIMERCOUNTER_OBJ) $(HDRS)
	$(CC) -o ue9TimerCounter $(UE9TIMERCOUNTER_OBJ) $(LDFLAGS) $(LIBS)

ue9allio: $(UE9ALLIO_OBJ) $(HDRS)
	$(CC) -o ue9allio $(UE9ALLIO_OBJ) $(LDFLAGS) $(LIBS)

ue9EFunctions: $(UE9EFUNCTIONS_OBJ) $(HDRS)
	$(CC) -o ue9EFunctions $(UE9EFUNCTIONS_OBJ) $(LDFLAGS) $(LIBS)

ue9LJTDAC: $(UE9LJTDAC_OBJ) $(HDRS)
	$(CC) -o ue9LJTDAC $(UE9LJTDAC_OBJ) $(LDFLAGS) $(LIBS)

clean:
	rm -f *.o *~ ue9BasicCommConfig ue9SingleIO ue9ControlConfig ue9Feedback ue9Stream ue9TimerCounter ue9allio ue9EFunctions ue9LJTDAC ue9EthernetExample
