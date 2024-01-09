This app uses the Tektronix tm_measure library and Flojoy vary the output frequency of an AFG31000.

First the necessary blocks were added:

- `CONNECT_AFG31000`
- `FUNCTION_AFG31000`
- `OUTPUT_AFG31000`
- `LOOP`
- 2x `SCALAR`
- `MULTIPLY`
- `INPUT_PARAM_AFG31000`

Each of these blocks must change the `connection` parameter to the correct instrument. The source used was *CH1* so all the blocks were changed to turn this output on and to affect this channel only. To vary the frequency between 1 kHz and 10 MHz, the ***parameter*** param was changed to "frequency" for `INPUT_PARAM_AFG31000` and `SCALAR 1` was set to 680.2721. `SCALAR 2` was then set to 1.47 which will multiply the last parameter by 1.47 each loop. `LOOP` was changed to loop 25 times. This resulted in frequency values of ~1.0, ~1.5, ~2.2 kHz, etc. until ~10 MHz.

The blocks were connected as shown and the app was run.
