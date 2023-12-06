In this example, an Tektronix AFG31000 is used to generate two waveforms.

First the necessary blocks were added:

- `CONNECT_AFG31000`
- `RESET_AFG31000`
- 2x `FUNCTION_AFG31000`
- `ALIGN_PHASES_AFG31000`
- `OUTPUT_AFG31000`
- `SAVE_STATE_AFG31000`

The instrument address was set for each `AFG31000` block. Ensure the `OUTPUT_AFG31000` block has both channels turn on.

The blocks were connected as shown and the app was run. The `SAVE_STATE_AFG31000` block can be used to save and recall the current state of the AFG. However, you must use a `OUTPUT_AFG31000` block to turn the outputs back on.

An oscilloscope was connected to the AFG31000 resulting in waveform:

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1701277906/flojoy-docs/afg31000/afg31000_basic.png)
