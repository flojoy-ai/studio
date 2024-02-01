This app shows how to use input stream blocks for with National Instruments Compact DAQ module.

Blocks used:

- `CREATE_TASK_ANALOG_INPUT_CURRENT`
- `CONFIG_INPUT_STREAM`
- `READ_INPUT_STREAM`
- `READ_INPUT_STREAM_INTO_BUFFER`
- 2x `LINE`
- `PRINT_DATACONTAINER`
- `TEXT_VIEW`
- `TIMER`
- `LOOP`

The blocks were connected as shown, and the app was run. The result displayed the first 100 samples from an analog module in the first plot and constantly updated the second plot with the latest data from the device buffer.

