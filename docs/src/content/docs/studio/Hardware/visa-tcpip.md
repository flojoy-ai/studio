---
id: visa-tcpip
title: VISA Ethernet Troubleshooting
sidebar:
  order: 10
---

:::note
Ethernet is the recommended connection type for VISA instruments.
:::

[VISA](https://en.wikipedia.org/wiki/Virtual_instrument_software_architecture) (Virtual Instrument Software Architecture) is a standardized interface for communcating with test and measurement instruments, such as oscilloscopes and multimeters. Many possible connection types are possible including: GPIB, TCP/IP (ethernet), and USB. For Ethernet connections, some changes may be required on your computer in order for Flojoy (and Python in general) to connect to the instrument. This guide will cover those changes. Other guides are in progress for other connection types. If your computer does not have an open ethernet connection, it is recommended to have a USB to ethernet adapter for connections

Note that there's three different types of connections here:

- Internet - not discussed here.
- LAN - instrument and computer and both connected to the router (recommended if possible).
- Link-local - the instrument is connected directly to the computer (aka APIPA).

If you are using a LAN connection make sure the instrument is set to DCHP (Dynamic Host Configuration Protocol). This should connect to multiple instruments without any changes. If you have static IP addresses this does not apply. Please contact your network admin.

The rest of this page will discuss link-local connections. Note that this guide will require changed to the IP settings for both the computer and the instrument.

## Linux (Ubuntu)

These settings may look slightly different on other Linux distros but likely function the same.

On Ubuntu, the connection type must be changed to link-local.

- Go to *Settings* → *Networking*
- Press the setting icon beside the wired connection.
- *IPv4*
- Select *Link-Local Only*

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704736174/flojoy-docs/ethernet/ubuntu-link-local.png)

Some instruments will not require futher changes at this point (check Flojoy's Hardware Devices tab and refresh). However, you may have to manually change the instrument's IP settings. See below for instrument settings.

## Windows

On Windows it's likely a link-local connection will be *automatic*. In case you have to set a static IP address:

- Go to *Network Connections*.
- Find the correct connection (perhaps by unplugging and plugging the connection back in).
- Right click on that connection and press properties.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704739268/flojoy-docs/ethernet/windows-setttings-1.png)

- Click on *Internet Protocol Version 4*.
- Press *Properties*.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704739269/flojoy-docs/ethernet/windows-settings-2.png)

- In the resulting menu you can set a static IP address by pressing *Use the following IP address*.
- You would then enter the address and mask as necessary.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704739266/flojoy-docs/ethernet/windows-settings-3.png)

Some instruments will not require futher changes at this point (check Flojoy's Hardware Devices tab and refresh). However, you may have to manually change the instrument's IP settings. See below for instrument settings.

## MacOS

Link-local settings do not work on Mac. An IP address of 169.254.Y.X must be set with a subnet mask of 255.255.255.0. The Y value must match on the instrument and computer (while X must *not* match). For example, 169.254.111.112 on the computer and 169.254.111.113 on the instrument.

To change the IP address:

- Go to *Settings* → *Network*
- Find the correct connection (perhaps by unplugging and plugging the connection back in).
- Click on the connection

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704736174/flojoy-docs/ethernet/mac-ethernet.png)

- Click *Details...*

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704736174/flojoy-docs/ethernet/mac-details.png)

- Select *Manually* in the *Configure IPv4* section.
- Enter a 169.254.Y.X *IP address* (write it down)
- Enter 255.255.255.0 for *Subnet mask*

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704736174/flojoy-docs/ethernet/mac-ipv4.png)

- The instrument's IP address will have to match the first 3 sections (e.g. 169.254.1.X here)

## Instrument settings

A link-local IP address must be 169.254.X.X with a subnet mask of 255.255.0.0. For example, 169.254.111.112, but this value should not be equal to the IP address on the computer. You can find your computers IP addresses in the *Debug Menu* on the *Hardware Devices* tab in Flojoy. Here the instrument is a Tektronix AFG31000, and the network settings are found under *Utility* → *I/O Interface* → *LAN* (on the instrument).

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704736174/flojoy-docs/ethernet/afg-settings.jpg)

The instrument should appear under Flojoy's Hardware Devices at this point (make sure to refresh).

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704736174/flojoy-docs/ethernet/one-device.png)

For MacOS, use a 169.254.Y.X IP address where *Y* matches the value used on the computer (and use 255.255.255.0 for *Subnet mask*). For example 169.254.111.112 on the computer and 169.254.111.113 on the instrument.

## Multiple instruments

Connecting two instruments through two different ethernet ports posed challenges with link-local settings. An ethernet switch will likely be needed to create multiple connections (or connect through LAN). This results in connecting both instruments through one ethernet port on the computer. The connection should still be set to link-local on Ubuntu and static 169.254.Y.X on MacOS. Windows will still likely connect automatically.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1704736174/flojoy-docs/ethernet/two-devices.png)
