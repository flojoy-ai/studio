This app shows how to use a thermocouple and voltage input blocks for with National Instruments Compact DAQ modules.

Blocks used:

- `CREATE_TASK_ANALOG_INPUT_THERMOCOUPLE`
- `CREATE_TASK_ANALOG_INPUT_VOLTAGE`
- `CONFIG_TASK_SAMPLE_CLOCK_TIMINGS`
- `TASK_WAIT_UNTIL_DONE`
- 2x `READ_TASK`
- 2x `LINE`

The blocks were connected as shown, and the app was run. The result displayed the first 100 samples taken from the two devices' buffer for multiple channels. The app ensures that the operation is complete for the thermocouple task before stopping it.