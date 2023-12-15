---
id: visa-usb
title: VISA USB Troubleshooting
sidebar:
  order: 5
---

:::note
Only use this method if your device does not show up with `PyVISA` list resources command.
:::

[VISA](https://en.wikipedia.org/wiki/Virtual_instrument_software_architecture) (Virtual Instrument Software Architecture) is a standardized interface for communcating with test and measurement instruments, such as oscilloscopes and multimeters. Many possible connection types are possible including: GPIB, TCP/IP (ethernet), and USB. For USB connections, some changes may be required on your computer in order for Flojoy (and Python in general) to connect to the instrument. This guide will cover those changes. Other guides are in progress for other connection types.

:::caution
These changes require some permission changes or downloads from the internet. Proceed at your own risk.
:::

:::note
Many VISA compatible instruments also have an ethernet/TCPIP connection in addition to a USB connection. This should require no drivers to use. If you do not have an available connection, an ethernet to USB adapter should suffice.
:::

Only proceed if you are sure your device does not appear with the following Python script (requires `pyvisa` _and_ `pyvisa-py` packages):

```python
import pyvisa

rm = pyvisa.ResourceManager('@py')
print(rm.list_resources())
```

## Linux

For Unix systems, it may be required to allow non-root access to USB ports. You can do this for all device with the terminal command:

```
sudo echo 'SUBSYSTEM=="usb", MODE="0666", GROUP="usbusers"' >> /etc/udev/rules.d/99-com.rules
```

Or, you can allow root access on a per-device basis by following this tutorial: https://www.xmodulo.com/change-usb-device-permission-linux.html.

## Windows

:::note
Fljoy currently requires a Powershell version >7 to launch. Additionally Flojoy has not been tested on any system below Windows 10.
:::

For Windows, the only change that should be required is to install a generic USB driver for the instrument. _Note that if a specific driver is already installed (e.g. TekVISA), it must be overwritten._ There are two ways to accomplish this:

1. Download [Zadig](https://zadig.akeo.ie/) and replace/install the driver (mostly) automatically.
2. Manually download the driver and install it in `Device Manager`.

In both methods ensure your device is plugged in and showing up in `Device Manager`.

### 1. Zadig Method

[Detailed Instructions](https://github.com/pbatard/libwdi/wiki/Zadig)

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1699910544/flojoy-docs/windowsdriver/naffpdp5cxbsu4z2ghre.png)

- Install [Zadig](https://zadig.akeo.ie/) (v2.8 as of Sept-22-2023)
- Run `zadig-2.8.exe`
- Find your device in the top dropdown menu.
- If a driver is already installed, you may need to press `Options` `->` `List All Devices`.
- Choose `WinUSB` (> v6.1) to the right of the green arrow.
- Press `Install Driver`.
- You may need to restart your system for the changes to work.

You may also have to place the `libusb-1.0.dll` file in `C:/Windows/System32` as described below.

### 2. Manual Method

You must first download the file `libusb-1.0.dll`:

- https://libusb.info/, go to `Downloads`, `Latest Windows Binaries`
- This should download `libusb-1.0.26-binaries.7z`. Extract or open this file.
- In `/libusb-1.0.26-binaries/VS2015-x64/dll` copy `libusb-1.0.dll`.
- Place this in `C:/Windows/System32`.

You must then chose the driver to install for the device.

- First go to `Device Manager` (e.g. by using the start menu search bar)
- Find the device. If no driver is install it will likely appear under `Other devices`.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1699910545/flojoy-docs/windowsdriver/vzvtrvecuaaogptjtq17.png)

- Right click on the device and select `Update Driver`.
- In the new window press `Browse my computer for drivers`,
- and then `Let me pick ...` at the bottom.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1699910544/flojoy-docs/windowsdriver/dqm0awb4ilcg7m5f4prk.png)
![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1699910545/flojoy-docs/windowsdriver/yoxoyiv03kup6cunikyv.png)

- Press `Universal Serial Bus devices`.
- In the left box click `WinUSB Device`,
- and in the right box click `WinUSB Device`.
- Click `Next` and install the driver.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1699910544/flojoy-docs/windowsdriver/busdevice.png)
![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1699910545/flojoy-docs/windowsdriver/winusb.png)

## Mac

You likely will have to allow USB non-root access such as in the Linux section above. There may be other changes necessary as well.

#### TODO
