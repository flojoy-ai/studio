In this example, the `MOVE_POSE` node moves the robot arm to a specified Cartesian position while also considering the orientation of the tool.

The node takes in the x, y, and z coordinates, along with optional alpha, beta, and gamma rotations in radians.

After initiating the movement, the node waits for the robot arm to become idle, indicating that the movement is complete.

The `MOVE_POSE` node is particularly useful in workflows where both the position and orientation of the robot arm are crucial, such as aligning the arm with an object before picking it up.
