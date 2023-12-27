This app uses the Tektronix tm_measure library to decode I2C using a Tektronix MSO24 oscilloscope.

First the necessary blocks were added:

- 1 `CONNECT_MSO2X`
- 1 `I2C_TRIGGER_MSO2X`
- 1 `SINGLE_TRIGGER_MSO2X`
- 1 `DECODE_I2C_MSO2X`
- 1 `TEXT_VIEW`

Each of these blocks must change the `connection` parameter to the correct instrument. The parameters were changed to match the setup: the ***clock_channel*** and ***data_channel*** parameters were changed to the proper analog or digital channel. The `I2C_TRIGGER_MSO2X` parameters were changed to trigger on the corrent signal. For example:

- ***condition*** = address
- ***addr_bits*** = 7
- ***addr*** = 0010

therefore the actual address will be XXX0010 where *X* corresponds to a wildcard (0 or 1).

The blocks were connected as shown and the app was run.
