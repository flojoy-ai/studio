#
# Makefile for U3 examples
#
U3FEEDBACK_SRC=u3Feedback.c u3.c
U3FEEDBACK_OBJ=$(U3FEEDBACK_SRC:.c=.o)

U3CONFIGU3_SRC=u3BasicConfigU3.c
U3CONFIGU3_OBJ=$(U3CONFIGU3_SRC:.c=.o)

U3ALLIO_SRC=u3allio.c u3.c
U3ALLIO_OBJ=$(U3ALLIO_SRC:.c=.o)

U3STREAM_SRC=u3Stream.c u3.c
U3STREAM_OBJ=$(U3STREAM_SRC:.c=.o)

U3EFUNCTIONS_SRC=u3EFunctions.c u3.c
U3EFUNCTIONS_OBJ=$(U3EFUNCTIONS_SRC:.c=.o)

U3LJTDAC_SRC=u3LJTDAC.c u3.c
U3LJTDAC_OBJ=$(U3LJTDAC_SRC:.c=.o)

SRCS=$(wildcard *.c)
HDRS=$(wildcard *.h)

CFLAGS +=-Wall -g
LIBS=-lm -llabjackusb

all: u3BasicConfigU3 u3Feedback u3allio u3Stream u3EFunctions u3LJTDAC

u3BasicConfigU3: $(U3CONFIGU3_OBJ)
	$(CC) -o u3BasicConfigU3 $(U3CONFIGU3_OBJ) $(LDFLAGS) $(LIBS)

u3Feedback: $(U3FEEDBACK_OBJ) $(HDRS)
	$(CC) -o u3Feedback $(U3FEEDBACK_OBJ) $(LDFLAGS) $(LIBS)

u3allio: $(U3ALLIO_OBJ) $(HDRS)
	$(CC) -o u3allio $(U3ALLIO_OBJ) $(LDFLAGS) $(LIBS)

u3Stream: $(U3STREAM_OBJ) $(HDRS)
	$(CC) -o u3Stream $(U3STREAM_OBJ) $(LDFLAGS) $(LIBS)

u3EFunctions: $(U3EFUNCTIONS_OBJ) $(HDRS)
	$(CC) -o u3EFunctions $(U3EFUNCTIONS_OBJ) $(LDFLAGS) $(LIBS)

u3LJTDAC: $(U3LJTDAC_OBJ) $(HDRS)
	$(CC) -o u3LJTDAC $(U3LJTDAC_OBJ) $(LDFLAGS) $(LIBS)

clean:
	rm -f *.o *~ u3Feedback u3BasicConfigU3 u3allio u3Stream u3EFunctions u3LJTDAC
