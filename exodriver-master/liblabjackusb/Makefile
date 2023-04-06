#
# Makefile for liblabjackusb
#
#

UNAME = $(shell uname -s)

VERSION = 2.7.0
PREFIX ?= /usr/local
DESTINATION = $(DESTDIR)$(PREFIX)/lib
HEADER = labjackusb.h
HEADER_DESTINATION = $(DESTDIR)$(PREFIX)/include
LIBFLAGS = -lusb-1.0 -lc
ADD_LDCONFIG_PATH = ./add_ldconfig_path.sh

ifeq ($(UNAME),Darwin)
	#Mac OS X operating system macros
	ext = dylib
	TARGET = liblabjackusb-$(VERSION).$(ext)

	# Build for only the host architecture
	#ARCHFLAGS =

	# Build for 32- and 64-bit Intel architectures
	#ARCHFLAGS = -arch i386 -arch x86_64

	# Build for multiple architectures
	#ARCHFLAGS = -arch i386 -arch x86_64 -arch ppc

	COMPILE = $(CC) -dynamiclib -o $(TARGET) -install_name $(TARGET) -current_version $(VERSION) -compatibility_version $(VERSION) labjackusb.o $(LIBFLAGS) $(ARCHFLAGS)

	# By default, create link from
	# liblabjackusb.dylib to liblabjackusb-$(VERSION).dylib
	# because ldconfig will not be run on Mac
	RUN_LDCONFIG ?= 0
	LINK_SO ?= 1
else
	#Linux operating system macros
	ext = so
	TARGET = liblabjackusb.$(ext).$(VERSION)

	# Build for only the host architecture
	#ARCHFLAGS =

	COMPILE = $(CC) -shared -Wl,-soname,liblabjackusb.$(ext) -o $(TARGET) labjackusb.o $(LIBFLAGS)

	# By default, do not create link from
	# liblabjackusb.dylib to liblabjackusb-$(VERSION).dylib
	# because ldconfig will be run on Linux
	RUN_LDCONFIG ?= 1
	LINK_SO ?= 0
endif

CFLAGS += -fPIC -g -Wall $(ARCHFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $<

all: $(TARGET)

$(TARGET): labjackusb.o $(HEADER)
	$(COMPILE)

install: $(TARGET)
	test -z $(DESTINATION) || mkdir -p $(DESTINATION)
	install $(TARGET) $(DESTINATION)
	test -z $(HEADER_DESTINATION) || mkdir -p $(HEADER_DESTINATION)
	install $(HEADER) $(HEADER_DESTINATION)
ifeq ($(RUN_LDCONFIG),1)
	@$(ADD_LDCONFIG_PATH) $(DESTINATION)
	ldconfig
endif
ifeq ($(LINK_SO),1)
	ln -i -s $(DESTINATION)/$(TARGET) $(DESTINATION)/liblabjackusb.$(ext)
endif

clean:
	rm -f $(TARGET) *.o *~
