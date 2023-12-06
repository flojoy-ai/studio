In this example, `BASIC_OSCILLATOR` node generates a signal that's 10 seconds long with a sample rate of 50.
The generated signal is a sawtooth with a starting frequency of 1.

It is then sent to a `BUTTER` node that filters out frequencies above 5 with a `filter_order` of 4. 
Since we want the lower frequencies to pass through, the `lowpass` option is selected for the `btype` option.