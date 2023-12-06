In this example, the `CONNECT` node establishes a connection with the MECADEMIC MECA500 robot arm.

The node takes in the IP address of the robot arm as an input. It initializes the handle map and adds a handle for the given IP address.

Upon successful connection, the node returns the IP address, confirming that the robot arm is now connected and ready for further operations.

The `CONNECT` node is used at the beginning of a workflow to ensure that a connection is established before any other operations are carried out.
