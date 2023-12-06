In this example, the `DISCONNECT` node terminates the connection with the MECADEMIC MECA500 robot arm.

After ensuring the robot arm is idle, the node deactivates the robot and waits for confirmation of deactivation. It then disconnects from the robot arm entirely.

The `DISCONNECT` node should always used at the end of a workflow to safely terminate the connection and ensure that the robot arm is in a deactivated state.
