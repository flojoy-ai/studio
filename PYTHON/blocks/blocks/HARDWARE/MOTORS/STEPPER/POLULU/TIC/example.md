---
title: STEPPER_DRIVER_TIC
description: This node controls a stepper motor movement with a TIC driver. The user defines the speed and the sleep time between movements.
keyword: [Python, Instrument, Stepper motor control, Python integration with stepper driver, Motion control and automation, Python"-"based stepper motor control, Stepper motor driver integration, Accurate motor movement with Python, Enhance motion control with Python, Streamline motor automation, Precise motor control using Python, Python control of stepper driver TIC]
image: https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/INSTRUMENTS/STEPPER_MOTOR/STEPPER_DRIVER_TIC/examples/EX1/output.jpeg
---

In this example, the [`STEPPER_DRIVER_TIC`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/STEPPER_MOTOR/STEPPER_DRIVER_TIC/STEPPER_DRIVER_TIC.py) node controls a stepper motor movement with a TIC driver.

First, the user must define the current limitation, which depends on the motor's size and model.
After that, he can set the speed and choose the sleep time between movements.

Then, after clicking the PLAY button, the motor will move between the four default positions. (To choose positions, use the [`STEPPER_DRIVER_TIC_KNOB`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/STEPPER_MOTOR/STEPPER_DRIVER_TIC_KNOB/STEPPER_DRIVER_TIC_KNOB.py) node.)

To create a repetitive movement, use the [`LOOP`](https://github.com/flojoy-io/nodes/blob/main/LOGIC_GATES/LOOPS/LOOP/LOOP.py) node.