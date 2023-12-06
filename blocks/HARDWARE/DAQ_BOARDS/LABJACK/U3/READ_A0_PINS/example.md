---
title: LABJACKU3
description: In this example, we show how to record and display temperature measurements with a LABJACK U3 device and update them in a Loop.
keyword: [Python, Instrument, LabJack U3 instrument control, Python integration with LabJack, Measurement and analysis, Python-based instrument control, LabJack U3 integration techniques, Python-based measurement techniques, Enhance measurements with Python, Streamline LabJack usage, Accurate data analysis, Python control of LabJack U3]
image: https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/INSTRUMENTS/LABJACK/LABJACKU3/examples/EX1/output.jpeg
--- 

In this example, we show how to record and display temperature measurements with a LABJACK U3 device and update them in a Loop. The appendix contains all information about hardware requirements and sensor connections (Images). You'll also need to install the Labjack exodriver to communicate with the U3 device through USB: https://labjack.com/pages/support?doc=/software-driver/installer-downloads/exodriver/.

When the sensors are connected to the LABJACK U3 device and placed to record temperature, you can prepare your Flojoy app:

The [`LABJACKU3`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/LABJACK/LABJACKU3/LABJACKU3.py) node communicates with the LABJACK U3 device to extract temperature measurements from the sensors. This node has only one parameter to fix: the number of sensors (6 in this example).

The [`BAR`](https://github.com/flojoy-io/nodes/blob/main/VISUALIZERS/PLOTLY/BAR/BAR.py) node displays all temperature measurements on the same figure.

To update the results with the latest measurements, we use the [`LOOP`](https://github.com/flojoy-io/nodes/blob/main/LOGIC_GATES/LOOPS/LOOP/LOOP.py) node to create a loop around our [`LABJACKU3`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/LABJACK/LABJACKU3/LABJACKU3.py) and [`BAR`](https://github.com/flojoy-io/nodes/blob/main/VISUALIZERS/PLOTLY/BAR/BAR.py) nodes. (Refer to the `LOOP` node documentation for more information).