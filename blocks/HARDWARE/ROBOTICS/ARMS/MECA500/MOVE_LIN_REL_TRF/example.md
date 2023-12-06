In this example, the `MOVE_LIN_REL_TRF` node moves the robot arm in a straight line to a specified Cartesian position.

The node takes in the x, y, and z coordinates, along with optional alpha, beta, and gamma rotations in radians.

After initiating the linear movement, the node waits for the robot arm to become idle, indicating that the movement is complete.

The `MOVE_LIN_REL_TRF` node is useful in workflows where linear movements are required, such as drawing a straight line or moving from one point to another in a straight path.
