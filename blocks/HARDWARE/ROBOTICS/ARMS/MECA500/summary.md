---
title: MECA500 
description: "Flojoy drivers for the Meca500 robotic arm."
---

## Introduction


Watch a video of Flojoy in action with Mecademic 500.

import { YouTube } from '@astro-community/astro-embed-youtube';

<div className="not-content">
<YouTube id="pPCiDQ4IMRU" />
</div>


Flojoy makes robotics programming easy, useful, and powerful. We've tailored Flojoy to program and control Mecademic's Meca500 robot arm.
Meca500 is a precise six-axis industrial robot designed for complex tasks in laboratory automation, electronics assembly, and similar precision-dependent environments.

Moreover, Flojoy allows for blocks-based visual programming, enabling users of all skill level to visually design the robot's operations for precise and efficient control. 

This documentation outlines the key features and functionalities of Flojoy in programming the Meca500.

## Programming Meca500 with Flojoy

1. Establish Connection:
   - **`Connect`**: Begin by setting up the connection to the Meca500 using the robot's IP address. This block initializes the communication link between Flojoy and the robot and is required to be run before any other robot arm movement.
   - **`Home`**: Essential for setting the robot to its default position, ensuring a consistent starting point for operations.
2. Programming movements
    - Use any of the Flojoy's configuration, standard movement, and library movement blocks below like `Move_Pose` and `Move_Circle` to control the robot's movement.
3. Ending the program
   - **`Disconnect`**: Concludes the program by linking to the Disconnect Block to safely disconnecting the robot.

## Flojoy Blocks for Meca500

#### Initialization & Termination Blocks

- **`Connect`**: Establishes the connection to the Meca500 using the robot's IP address, initializing the communication link.

- **`Home`**: Executes the homing procedure for all joints. During homing, joints rotate to find the exact angles with a precision of a few degrees. Essential for ensuring the robot starts from a known position.

- **`Disconnect`**: Safely disconnects the robot from Flojoy, ensuring no further actions are taken post-programming.

#### Configuration Blocks

- **`Set_Cart_Lin_Vel`**: Sets the maximum linear velocity for the robot's Tool Reference Frame (TRF) with respect to its World Reference Frame (WRF), affecting MoveLin and related commands.

- **`Set_Joint_Vel`**: Configures the velocity for joint movements, influencing commands like Move Joint.

- **`Set_Blending`**: Determines the blending level between consecutive movements, enabling smoother transitions.

- **`Delay`**: Introduces a pause in the sequence of operations, allowing for timed control of actions.

#### Standard Movements Blocks

- **`Move_Joint`**: Commands the robot to move its joints to specified angles, taking a linear path in joint space but nonlinear in Cartesian space.

- **`Move_Lin`**: Directs the robot's end-effector to a specific pose in a linear trajectory within Cartesian space, considering reorientations and turn configurations.

- **`Move_Pose`**: Moves the robot's TRF to a specific pose with respect to the WRF, calculating the most efficient joint set to reach the desired position.

#### Flojoy Custom Movements Blocks
- **`Move_Circle`**: Move circle is a node that moves the mecademic robot along a circular path defined by a center point in 3d space and a radius. It is equivalent to the combination of generate circle keyframes and move keyframes. This node is useful for executing circular moves in tool relative space. As a move node, it can be run any time after activation or a mecademic arm. A high blending value is recommended for a smooth circular move. 
- **`Move_Keyframes`**: Move keyframes executes a sequence of moves as defined in a data frame with columns x, y, z, alpha, beta, gamma, time. Timing is approximated by calculating a velocity based on mecademic’s maximum joint velocities, however the keyframes do not guarantee timing. A move keyframes node can be thought of as a shorthand for a sequence of move and set velocity nodes. As a move node, it can be run any time after the activation of a mecademic arm. 

#### Advanced Features
Flojoy, integrated with Mecademic's control system, brings the power of Python's core features into the realm of visual robotics programming. This integration not only facilitates traditional programming constructs like loops and conditional logic but also unlocks access to advanced machine learning (ML) functionalities.

## Future Works
Flojoy's new robotics team aims to make robotics visual programming easy, useful, and powerful. We are currently  working on
multi-hardware connectivity and exploring natural language and human collaboration based robotics control methods.

## All Blocks

