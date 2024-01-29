---
title: Using StarTech RS232 to USB
slug: "startech/rs232-to-usb"
---


# Using the Startech RS232-USB adapter to control VISA instruments with SCPI commands.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706134282/flojoy-docs/prologix/prologix-adapter.png)

## Device Setup

If the adapter is not present after refreshing the `Hardware Devices` menu, follow the instructions specific to your OS below. You may have to download the driver for Windows and MacOS, and for Linux you may have to change some permissions.

The manual for the adapter can be found [here](https://sgcdn.startech.com/005329/media/sets/ICUSB232V2_Manual/ICUSB232V2_QSG.pdf)

:::note
The name of the device may change in Flojoy. For example, in Windows the device in Flojoy may be simply USB Serial Port (COM#).
:::

![image](linux flojoy hardware devices)

### Windows

Driver should automatically install and the adapter should show as a `Prolific PL2303GT USB Serial COM Port` in Device Manager. Remember the COM number for later. If the driver is not properly installed, the driver can be downloaded [here](https://www.startech.com/en-us/cards-adapters/icusb232v2) (prolific_pl2303 windows usb serial adapter.zip). 

1. Disconnect the adapter
2. Extract the zip file
3. Run the `PL23XX-M_LogoDriver_Setup_v301_20211221.exe` executable
4. Follow the on screen instructions
5. Connect the adapter and confirm that Prolific USB-to-Serial Comm Port (COMx) appears in the list with no exclamation points or question marks.

![image](windows devices name)

Alternatively you can use [Zadig](https://zadig.akeo.ie/) to set the driver to `USB Serial (CDC)`

### Mac

Unplug adapter from the Mac and Instrument. Plug adapter into the computer. 

Driver should automatically install and the adapter should show in “Settings → About → System Report → Hardware → USB” as If the driver is not properly installed, the driver can be downloaded [here](https://www.startech.com/en-us/cards-adapters/icusb232v2) (prolific_pl2303 mac usb serial adapter.zip). 

![image](mac system report)

### Linux

The driver is included in the Linux kernel and is not available for download. Please contact Startech for device support if the driver is not installed on Linux.

However, you may have to add yourself (or the user), to a couple “Groups” for permission reasons. In Flojoy’s `Hardware Devices`, if the list of devices is not loading and is stuck on _loading…_, you likely have to follow these instructions. It is also possible the device will appear in Flojoy but you will get a permission error when you try to use a `SERIAL CONNECT` block.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706134280/flojoy-docs/prologix/linux-loading.png)

In the Terminal use `groups` to see the groups you are in. You need to be in `tty` and/or `dialout` groups. To add yourself to a group use `sudo usermod -a -G <group_name> <user_name>`, replacing <group_name> with either tty or dialout and <user_name> with your user name. Add `tty` first, restart the computer and see if `Hardware Devices` is still stuck loading. Add `dialout` if it is still not loading. The adapter should show up with the full name.

![image](linux device)

## Use of the adapter

In Flojoy, use of the adapter should begin with a `SERIAL CONNECT` block.
