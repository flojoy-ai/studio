In this example, the `SET_CART_LIN_VEL` node sets the linear velocity of the robot arm in Cartesian coordinates.

The node takes in a single parameter, v, which is the velocity to be set for the robot arm's movements.

After setting the velocity, the node doesn't wait for any specific state, meaning it's often used in conjunction with other movement nodes to control the speed of those movements.

The `SET_CART_LIN_VEL` node is useful in workflows where you need to control the speed of the robot arm's linear movements, such as when you're trying to synchronize the robot arm with another moving object.
