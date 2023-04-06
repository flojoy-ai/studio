#
# Makefile for U6 examples
#
U6ALLIO_SRC=u6allio.c u6.c
U6ALLIO_OBJ=$(U6ALLIO_SRC:.c=.o)

U6BASICCONFIGU6_SRC=u6BasicConfigU6.c
U6BASICCONFIGU6_OBJ=$(U6BASICCONFIGU6_SRC:.c=.o)

U6CONFIGU6_SRC=u6ConfigU6.c u6.c
U6CONFIGU6_OBJ=$(U6CONFIGU6_SRC:.c=.o)

U6EASY_SRC=u6EFunctions.c u6.c
U6EASY_OBJ=$(U6EASY_SRC:.c=.o)

U6FEEDBACK_SRC=u6Feedback.c u6.c
U6FEEDBACK_OBJ=$(U6FEEDBACK_SRC:.c=.o)

U6STREAM_SRC=u6Stream.c u6.c
U6STREAM_OBJ=$(U6STREAM_SRC:.c=.o)

U6LJTDAC_SRC=u6LJTDAC.c u6.c
U6LJTDAC_OBJ=$(U6LJTDAC_SRC:.c=.o)

SRCS=$(wildcard *.c)
HDRS=$(wildcard *.h)

CFLAGS +=-Wall -g
LIBS=-lm -llabjackusb

all: u6BasicConfigU6 u6ConfigU6 u6allio u6EFunctions u6Feedback u6Stream u6LJTDAC

u6BasicConfigU6: $(U6BASICCONFIGU6_OBJ)
	$(CC) -o u6BasicConfigU6 $(U6BASICCONFIGU6_OBJ) $(LDFLAGS) $(LIBS)

u6ConfigU6: $(U6CONFIGU6_OBJ)
	$(CC) -o u6ConfigU6 $(U6CONFIGU6_OBJ) $(LDFLAGS) $(LIBS)

u6allio: $(U6ALLIO_OBJ) $(HDRS)
	$(CC) -o u6allio $(U6ALLIO_OBJ) $(LDFLAGS) $(LIBS)

u6EFunctions: $(U6EASY_OBJ) $(HDRS)
	$(CC) -o u6EFunctions $(U6EASY_OBJ) $(LDFLAGS) $(LIBS)

u6Feedback: $(U6FEEDBACK_OBJ) $(HDRS)
	$(CC) -o u6Feedback $(U6FEEDBACK_OBJ) $(LDFLAGS) $(LIBS)

u6Stream: $(U6STREAM_OBJ) $(HDRS)
	$(CC) -o u6Stream $(U6STREAM_OBJ) $(LDFLAGS) $(LIBS)

u6LJTDAC: $(U6LJTDAC_OBJ) $(HDRS)
	$(CC) -o u6LJTDAC $(U6LJTDAC_OBJ) $(LDFLAGS) $(LIBS)

clean:
	rm -f *.o *~ u6Feedback u6BasicConfigU6 u6ConfigU6 u6allio u6Stream u6EFunctions u6LJTDAC
