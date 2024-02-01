---
title: Using the Startech RS232-USB adapter
slug: "startech/rs232-to-usb"
---

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706634427/flojoy-docs/rs232/rs232-adapter.jpg)

## Device Setup

:::warning
This adapter is "male" on the RS232 side. If your instrument is also "male", it's possible you will need a [null modem](https://en.wikipedia.org/wiki/Null_modem) Female/Female adapter as well. A straight-through F/F adapter will likely not work.
:::

If the adapter is not present after refreshing the `Hardware Devices` menu, follow the instructions specific to your OS below. You may have to download the driver for Windows and MacOS, and for Linux you may have to change some permissions.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706634425/flojoy-docs/rs232/rs232-website-drivers.png)

The manual for the adapter can be found [here](https://sgcdn.startech.com/005329/media/sets/ICUSB232V2_Manual/ICUSB232V2_QSG.pdf)

:::note
The name of the device may change in Flojoy. For example, in Windows the device in Flojoy may be simply USB Serial Port (COM#).
:::

### Windows

Driver should automatically install and the adapter should show as a `Prolific PL2303GT USB Serial COM Port` in Device Manager. Remember the COM number for later. If the driver is not properly installed, the driver can be downloaded [here](https://www.startech.com/en-us/cards-adapters/icusb232v2) (*prolific_pl2303 windows usb serial adapter.zip*).

1. Disconnect the adapter
2. Extract the zip file
3. Run the `PL23XX-M_LogoDriver_Setup_v301_20211221.exe` executable
4. Follow the on screen instructions
5. Connect the adapter and confirm that Prolific USB-to-Serial Comm Port (COMx) appears in the list with no exclamation points or question marks.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706634426/flojoy-docs/rs232/rs232-win-device.png)

Alternatively you can use [Zadig](https://zadig.akeo.ie/) to set the driver to `USB Serial (CDC)`.

### Mac

Unplug adapter from the Mac and Instrument then plug adapter into the Mac. If the adapter does not appear in Flojoy's `Hardware Devices`, you will have to install the driver for it. The driver can be downloaded [here](https://www.startech.com/en-us/cards-adapters/icusb232v2) (*prolific_pl2303 mac usb serial adapter.zip*). Run the pkg for your MacOS version (likely 11.x,12.x,13.x) such as *pl2303hxd_G_Mac Driver_v2.2.2_20221218.pkg*.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706631245/flojoy-docs/rs232/rs232-mac-drivername.png)

Follow the instructions on screen. If you are on an ARM system (M1, M2, etc.), you will likely need to install Rosetta.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706631246/flojoy-docs/rs232/rs232-mac-rosetta.png)

During installation you may also get an error about allowing extensions. Go to Privacy & Security in settings and look for the following. Press Allow.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706631244/flojoy-docs/rs232/rs232-mac-allow.png)

Hopefully you can now see the adapter under `Hardware Devices`.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706631245/flojoy-docs/rs232/rs232-mac-flojoy.png)

### Linux

The driver is included in the Linux kernel and is not available for download. Please contact Startech for device support if the driver is not installed on Linux.

However, you may have to add yourself (or the user), to 2 “Groups” for permission reasons. In Flojoy’s `Hardware Devices`, if the list of devices is not loading and is stuck on *loading…*, you likely have to follow these instructions. It is also possible the device will appear in Flojoy but you will get a permission error when you try to use a `OPEN SERIAL` block with the adapter.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706134280/flojoy-docs/prologix/linux-loading.png)

In the Terminal, use `groups` to see the groups you are in. You need to be in `tty` and/or `dialout` groups. To add yourself to a group use `sudo usermod -a -G <group_name> <user_name>`, replacing <group_name> with tty and dialout (seperately) and <user_name> with your user name. Restart the computer and the adapter should show up under `Hardware Devices`.

## Use of the adapter

In Flojoy, the adapter should function as if the instrument was connected directly to the computer. Use of the adapter should begin with a `OPEN SERIAL` block. You can then use the `SERIAL WRITE` block to write specific commands to the instrument, or use specific Blocks that utilize Serial connections.
