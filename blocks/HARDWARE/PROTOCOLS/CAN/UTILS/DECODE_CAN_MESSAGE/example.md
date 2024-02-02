This application demonstrates how to use multiple CAN blocks to connect to a PEAK-USB device and read messages from it. The PEAK-USB device is a USB-to-CAN interface that enables you to connect a computer to a CAN network. This device is used in this case to capture the messages of a particular sensor by filtering them directly at the kernel level, thus reducing the load on the CPU, and save those messages to a log file locally.

Once the app is done, the generated logs are exported to an S3 bucket to keep a record of the sensor's data for further analysis.

To replicate this application, you must connect the PEAK-USB to your computer and install the required driver (refer to the `PCAN_CONNECT` blocks for more information on the necessary driver for your platform). Then, simply specify the PEAK-USB channel in the required blocks, and this Flojoy application will log the messages received by the device!

**Detecting channels**
A valuable block is the `PCAN_DETECT_AVAILABLE_DEVICE`. This block allows you to display the devices using the PCAN interface that are connected to your computer.
