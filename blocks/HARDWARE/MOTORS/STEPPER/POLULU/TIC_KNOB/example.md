---
title: STEPPER_DRIVER_TIC_KNOB
description:  In this example, the STEPPER_DRIVER_TIC_KNOB node controls a stepper motor movement with a TIC driver. It allows you to control the motor's rotation with a KNOB button. From 0 to 100 corresponds to a rotation between 0 and 360 degrees.
keyword: [Python, Instrument, Stepper motor control with knob, Python integration with stepper driver, Motion control and automation, Python"-"based stepper motor control, Stepper motor driver integration, Accurate motor movement with Python, Enhance motion control with knob, Streamline motor automation, Precise motor control using Python, Python control of stepper driver TIC with knob]
image: https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/INSTRUMENTS/STEPPER_MOTOR/STEPPER_DRIVER_TIC_KNOB/examples/EX1/output.jpeg
---

In this example, the [`STEPPER_DRIVER_TIC_KNOB`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/STEPPER_MOTOR/STEPPER_DRIVER_TIC_KNOB/STEPPER_DRIVER_TIC_KNOB.py) node controls a stepper motor movement with a TIC driver. It allows you to control the motor's rotation with a KNOB button. (From 0 to 100 corresponds to a rotation between 0 and 360 degrees.)

First, the user must define the current limitation, which depends on the motor's size and model. After that, he can set the speed, the rotation, and the sleep time to create a specific movement for different applications. Then, after clicking the PLAY button, the motor will start moving.

After updating the knob position, click on PLAY again to initiate a new movement.

To create a repetitive movement, use the [`LOOP`](https://github.com/flojoy-io/nodes/blob/main/LOGIC_GATES/LOOPS/LOOP/LOOP.py) and [`GOTO`](https://github.com/flojoy-io/nodes/blob/main/LOGIC_GATES/LOOPS/GOTO/GOTO.py) nodes. 