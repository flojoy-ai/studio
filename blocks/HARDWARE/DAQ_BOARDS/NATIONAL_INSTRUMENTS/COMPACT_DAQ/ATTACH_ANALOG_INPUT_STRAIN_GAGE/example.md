This app shows how to use a strain gage input block for with a National Instruments Compact DAQ module.

Blocks used:

- `CREATE_TASK_ANALOG_INPUT_GAUGE`
- `CONFIG_TASK_SAMPLE_CLOCK_TIMINGS`
- `READ_TASK`
- `LINE`

The blocks were connected as shown, and the app was run. The result displayed the first 100 samples taken from the device buffer for 3 channels.