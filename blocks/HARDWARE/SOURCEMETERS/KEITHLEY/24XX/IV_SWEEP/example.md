---
title: IV_SWEEP 
description: In this example, we demonstrate how to record an I"-"V curve using Flojoy, a Keithley 2400 source meter, and a computer.
keyword: [Python, Instrument, Keithley 2400 control, Python instrument integration, Measurement and analysis, Python"-"based instrument control, Keithley instrument control, Enhance measurements with Python, Python"-"based measurement techniques, Streamline instrument usage, Accurate data analysis,Python integration with Keithley 2400]
image: https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/INSTRUMENTS/KEITHLEY/KEITHLEY2/examples/EX1/output.jpeg
--- 

In this example, we demonstrate how to record an I-V curve using Flojoy, a Keithley2400 source meter, and a computer. Fist you need to connect the Keithley2400 sourcemeter to the computer with a serial communication cable. Then, connect your device (Solar cell in this example) to the sourcemeter. After that you can prepare your flojoy app:

The [`LINSPACE`](https://github.com/flojoy-io/nodes/blob/main/GENERATORS/SIMULATIONS/LINSPACE/LINSPACE.py) node defines the voltage range sent to the electronic device. The user defines the voltage range by setting these parameters with Numeric Input:

- LINSPACE START: Define your first Voltage.
- LINSPACE END: Define your last Voltage.
- LINSPACE STEP: Define the number of voltages between the first and the last one.

The [`KEITHLEY2400`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/KEITHLEY/KEITHLEY2400/KEITHLEY2400.py) node will communicate with the source meter by serial communication to send voltages and measure currents from the device. 

The connection must first be opened using the [`OPEN_KEITHLEY_24XX`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/KEITHLEY/KEITHLEY2400/KEITHLEY2400.py) node, which has two communication parameters set by the user after connecting the Keithley2400 to their computer:

- DEVICE: Select the serial device that corresponds to the Keithley2400.
- BAUDRATE: Define the Baud rate of your communication protocol (the default is 9600, the value has to correspond to the Instrument settings).

The [`LINE`](https://github.com/flojoy-io/nodes/blob/main/VISUALIZERS/PLOTLY/LINE/LINE.py) node will display the I-V curve by plotting the currents received from the device as a function of the voltages transmitted to the device.

When the setup is ready, and the parameters above are well defined, the experiment can be started by turning on the source meter and clicking the PLAY button.
