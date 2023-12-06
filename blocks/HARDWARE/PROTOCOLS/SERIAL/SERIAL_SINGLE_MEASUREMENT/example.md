---
title: SERIAL_SINGLE_MEASUREMENT
description:  In this example, we use the SERIAL_SINGLE_MEASUREMENT node to extract some measurements received from an Arduino microcontroller and visualize the output.
keyword: [Python, Instrument, Serial communication measurement, Python serial instrument integration, Data acquisition and analysis, Python"-"based serial measurement, Serial instrument integration techniques, Accurate measurement with Python, Enhance measurement with serial communication, Streamline data acquisition, Precise measurement using Python, Python control of serial single measurement]
image: https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/INSTRUMENTS/SERIAL/SERIAL_SINGLE_MEASUREMENT/examples/EX1/output.jpeg
---

In this example, we use the `SERIAL_SINGLE_MEASUREMENT` node to extract some measurements
received from an Arduino microcontroller and visualize the output.

First, you need to connect the Arduino to your computer. Then, you'll need to upload an Arduino script to your board to define its behavior (with the Arduino IDE software). When your Arduino sends data to the serial monitor of the Arduino IDE, you can start using the [`SERIAL_SINGLE_MEASUREMENT`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/SERIAL/SERIAL_SINGLE_MEASUREMENT/SERIAL_SINGLE_MEASUREMENT.py) node. After placing the node on Flojoy, you must specify the communication port to which the Arduino is connected. This port is found in the Arduino IDE software under _Tools/Port_.

The [`SERIAL_SINGLE_MEASUREMENT`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/SERIAL/SERIAL_SINGLE_MEASUREMENT/SERIAL_SINGLE_MEASUREMENT.py) node receives data through serial communication with the Arduino, and stores the measured values in a table called `reading`. The Arduino then prints new values on the serial console for each loop. The [`SERIAL_SINGLE_MEASUREMENT`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/SERIAL/SERIAL_SINGLE_MEASUREMENT/SERIAL_SINGLE_MEASUREMENT.py) node extracts a measurement (which can contain single or multiple values, as seen in the output).

The [`TABLE`](https://github.com/flojoy-io/nodes/blob/main/VISUALIZERS/PLOTLY/TABLE/TABLE.py) node displays all values stored in the single measurement.

**Remarks about the Arduino code:**

This example works with the `arduino_example.ino` Arduino code (see Appendix). 

The last line that the Arduino should return, is the data with a new line at the end (i.e. `println()`).

For example:

    print(reading0)
    print(",")
    println(reading1)

The [`SERIAL_SINGLE_MEASUREMENT`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/SERIAL/SERIAL_SINGLE_MEASUREMENT/SERIAL_SINGLE_MEASUREMENT.py) node receives data from the Arduino serial console as a string and splits it using "," as a separator. It then returns the values measured in a list called `reading`.

**Update the Single Measurement with a Loop:**

To update the values received from the Arduino, use the [`LOOP`](https://github.com/flojoy-io/nodes/blob/main/LOGIC_GATES/LOOPS/LOOP/LOOP.py) node to create a loop around the [`SERIAL_SINGLE_MEASUREMENT`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/SERIAL/SERIAL_SINGLE_MEASUREMENT/SERIAL_SINGLE_MEASUREMENT.py) and [`TABLE`](https://github.com/flojoy-io/nodes/blob/main/VISUALIZERS/PLOTLY/TABLE/TABLE.py) nodes.

The loop allows the user to update measurements, but only the last measurement will be saved and displayed.

To record all the measurements for a given period, use the [`SERIAL_TIMESERIES`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/SERIAL/SERIAL_TIMESERIES/SERIAL_TIMESERIES.py) node.
