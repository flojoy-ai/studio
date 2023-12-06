In this example, the `SET_JOINT_VEL` node sets the angular velocity for the joints of the robot arm.

The node takes in a single parameter, v, which is the angular velocity to be set for each joint of the robot arm.

After setting the velocity, the node doesn't wait for any specific state, meaning it's often used in conjunction with other movement nodes to control the speed of those movements.

The `SET_JOINT_VEL` node is useful in workflows where you need to control the speed of the robot arm's joint movements, such as when performing tasks that require varying speeds for different joints.
