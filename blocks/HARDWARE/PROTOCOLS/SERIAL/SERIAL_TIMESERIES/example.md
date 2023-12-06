---
title: SERIAL_TIMESERIES
description:  In this example, we use the SERIAL_TIMESERIES node to extract some time-dependent measurements received from an Arduino microcontroller and visualize the output.
keyword: [Python, Instrument, Serial communication timeseries, Python serial data acquisition, Time"-"series data analysis, Python-based serial data collection, Serial data acquisition techniques, Accurate timeseries recording with Python, Enhance data analysis with serial communication, Streamline timeseries data acquisition, Precise data collection using Python, Python control of serial timeseries data]
image: https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/INSTRUMENTS/SERIAL/SERIAL_TIMESERIES/examples/EX1/output.jpeg
---

In this example, we use the `SERIAL_TIMESERIES` node to extract some time-dependent measurements received from an Arduino microcontroller, and visualize the output.

First, you need to connect the Arduino to your computer. Then, you'll need to upload an Arduino script to your board to define its behavior (with the Arduino IDE software). When your Arduino sends data to the serial monitor of the Arduino IDE, you can start using the [`SERIAL_TIMESERIES`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/SERIAL/SERIAL_TIMESERIES/SERIAL_TIMESERIES.py) node. After placing the node on Flojoy, you must specify the communication port to which the Arduino is connected. This port is found in the Arduino IDE software under _Tools/Port_.

The [`SERIAL_TIMESERIES`](https://github.com/flojoy-ai/nodes/blob/main/INSTRUMENTS/SERIAL/SERIAL_TIMESERIES/SERIAL_TIMESERIES.py) node receives data through serial communication with the Arduino, and stores the measured values in a table named `readings`. The Arduino prints new values on the serial console for each loop. The [`SERIAL_TIMESERIES`](https://github.com/flojoy-ai/nodes/blob/main/INSTRUMENTS/SERIAL/SERIAL_TIMESERIES/SERIAL_TIMESERIES.py) node then extracts a single measurement (for this node, each time dependant measurement must contain only one value).

The [`TABLE`](https://github.com/flojoy-io/nodes/blob/main/VISUALIZERS/PLOTLY/TABLE/TABLE.py) node displays all values stored in the timeseries measurement.

**Remarks about the Arduino code:**

In order to use this node properly, you need to print one value per line using the command (i.e. `println()`).

For example:

    println(reading)
