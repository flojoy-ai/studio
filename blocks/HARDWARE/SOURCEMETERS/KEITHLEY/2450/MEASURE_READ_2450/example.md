In this example, a Keithley 2450 to generate 1V and then sweep between 0 and 1V.

First the necessary blocks were added:

- `CONNECT_2450`
- `BEEP_2450`
- `RESET_2450`
- `SOURCE_2450`
- `MEASURE_SETTINGS_2450`
- `MEASUREMENT_READ_2450`
- `IV_SWEEP_2450`
- `BIG_NUMBER`
- `LINE`

The instrument address was set for each `2450` block. The `SOURCE_2450` block was changed in order to source 1V. The parameters in the `MEASURE_SETTINGS_2450` block were changed as necessary. The `MEASUREMENT_READ_2450` block was connected to the `BIG_NUMBER` block in order to view the reading.

The `IV_SWEEP_2450` block output was connected to the `LINE` plot to show the output of the sweep.

The blocks were connected as shown and the app was run.
