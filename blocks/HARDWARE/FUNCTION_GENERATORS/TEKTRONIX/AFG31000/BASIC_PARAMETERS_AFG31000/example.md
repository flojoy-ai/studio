In this example, an Tektronix AFG31000 is used to generate an arbitrary waveform.

First the necessary blocks were added:

- `CONNECT_AFG31000`
- `COPY_AFG31000`
- `ARBITRARY_AFG31000`
- `BASIC_PARAMETERS_AFG31000`
- `OUTPUT_AFG31000`
- 3x `BASIC_OSCILLATOR`
- `MULTIPLY`
- `LINE`

The instrument address was set for each `AFG31000` block. Ensure the `OUTPUT_AFG31000` block has channel 1 output turned on. Note the `COPY_AFG31000` block is rename `PLACEHOLDER` here and it preset for block running order reasons. The `BASIC_PARAMETERS_AFG31000` block is used to change frequency, offset, voltage, and phase for a single channel, without changing the function itself.

The blocks were connected as shown and the app was run. The 3 `BASIC_OSCILLATOR` blocks were used to generate the arbitrary waveform. Any waveform generated in Flojoy can be used as the input for `ARBITRARY_AFG31000` to allow for any output.

An oscilloscope was connected to the AFG31000 resulting in waveform:

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1701277907/flojoy-docs/afg31000/afg31000_arb.png)
