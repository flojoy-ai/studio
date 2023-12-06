In this example, `BASIC_OSCILLATOR` generates a sine wave that has a sample rate of 30Hz over 2 seconds.

The output is then added to a `RAND` node that takes in a `LINSPACE` node to generate an array of 60 random numbers over 2 seconds.
The result is a noisy signal resembling a sine wave.

To clean up the signal, the `SAVGOL` node is used with a `window_length` of 20 and a `poly_order` of 3, which smoothens out the noisy signal.