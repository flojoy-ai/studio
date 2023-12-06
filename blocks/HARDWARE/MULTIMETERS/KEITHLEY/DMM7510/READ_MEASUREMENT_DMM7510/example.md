In this example, a DC voltage measurement was extracted from a Keithley DMM7510.

First the necessary blocks were added:

- `CONNECT_DMM7510`
- `RESET_DMM7510`
- `FUNCTION_DMM7510`
- `DIGITS_DMM7510`
- `MEASUREMENT_PARAMS_DMM7510`
- `MEASUREMENT_FILTER_DMM7510`
- `READ_DMM7510`
- `BIG_NUMBER`

The instrument address was set for each `DMM7510` block. The `FUNCTION_DMM7510` block was changed in order to extract the correct measurement. The parameters in `DIGITS_DMM7510`, `MEASUREMENT_PARAMS_DMM7510`, and `MEASUREMENT_FILTER_DMM7510` blocks were changed as necessary. The `READ_DMM7510` block was connected to the `BIG_NUMBER` block in order to view the reading.

The blocks were connected as shown and the app was run.
