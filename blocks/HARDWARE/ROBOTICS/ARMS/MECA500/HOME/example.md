In this example, the `HOME` node homes the robot arm, setting it to its default position.

This node is essential to run before any other movement operations on the robot arm. It's recommended to use this node immediately after the `ACTIVATE` node to ensure the robot arm is in a known state.

After the homing process, the node waits for confirmation that the robot arm has been successfully homed.
