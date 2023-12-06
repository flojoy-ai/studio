In this example, `LINSPACE` generates an array of 600 samples, which would be the value of `step`.
The sample rate in this case is 800, so the `end` parameter is samples/sample_rate = 0.75.

The array is then passed down to two `SINE` nodes, with one generating a sine wave of 30hz with 1 amplitude,
and the other generating a sine wave of 100hz with 0.5 amplitude.

Finally, the signal is passed down to `FFT` which performs the fast fourier transform algorithm, 
transforming the input from the time domain into the frequency domain. Since we want to display the data,
the `display` option is set to true. The input signal is only consist of real numbers, so `real` is also true.
Note that a `hann` window is used here to reduce spectral leakage, but any other window type or no window also works.