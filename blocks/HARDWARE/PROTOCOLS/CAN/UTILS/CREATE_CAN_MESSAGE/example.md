This example shows how to send a frame to a CAN bus using the CANable USB-to-CAN adapter. The application sends a first frame intended to indicate the start of a test on a system. Subsequently, the application sends a burst of messages and then sends a frame to indicate the end of the test.

This application uses an `CANABLE_CONNECT` block to establish a connection to the CAN bus, but this connection could be replaced by any other connection. For example, the `PEAK_CONNECT` block could be used instead.
