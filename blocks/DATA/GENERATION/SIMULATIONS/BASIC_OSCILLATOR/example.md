In this example, `BASIC_OSCILLATOR` node generates a sine wave with a frequency of 1Hz and an amplitude of 3 for
10 seconds with a sample rate of 400Hz.

The same output can be generated with `LINSPACE` and `SINE` nodes combined.
`SINE` would have the same parameters, but for `LINSPACE`, the `start` parameter will be 0, `end` is the time, which is 10 in this case,
and `step` is the total samples, which is sample_rate * time in this case