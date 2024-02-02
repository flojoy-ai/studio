In this example, we utilize the `PCAN_CONNECT` and `PCAN_READ` node to save CAN bus messages received from a CAN bus sniffer (PEAK-USB) and present the output in a tabular format.

To replicate this application, you must connect the PEAK-USB to your computer and install the required driver (refer to the `PCAN_CONNECT` blocks for more information on the necessary driver for your platform). Then, simply specify the PEAK-USB channel in the `PCAN_CONNECT` and `PCAN_READ` blocks, and this Flojoy application will log the messages received by the device!
