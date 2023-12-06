In this example, `LINSPACE` generates an array of 600 samples, which would be the value of `step`.
The sample rate in this case is 800, so the `end` parameter is samples/sample_rate = 0.75.

The generated array is then passed down to two `SINE` nodes, with one generating a sine wave of 50hz with 1 amplitude,
and the other generating a sine wave of 80hz with 0.5 amplitude.

Then the sine wave is passed down to three different nodes, first a `LINE` node to display what it looks like.
Then two `FFT` nodes, one of which have the `display` option set to true, and then passed to another `LINE`
node to display the signal in the frequency domain. 
The other `FFT` node has the `display` option set to false in order to preserve the raw data, which isn't used for displaying. 

Finally, `FFT` node containing the raw data passes to an `IFFT` node, which performs the inverse fourier transform, 
changing the basis from the frequency domain back into the time domain. 
Since no modification is made(which we could've done), the signal come out the same as the original.