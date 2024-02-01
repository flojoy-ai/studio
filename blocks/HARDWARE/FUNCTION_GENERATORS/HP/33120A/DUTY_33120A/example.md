In this example, a HP 33120A is used to generate a waveform and save the setting for later use.

First the necessary blocks were added and their parameters set:

- `OPEN_SERIAL`
- `CLEAR BUFFER 33120A`
- `RESET 33120A`
- `IMPEDANCE 33120A`
- `TRIGGER 33120A`
- `VOLT UNIT 33120A` - *unit = VPP*
- `FUNCTION 33120A` - *waveform - square*
- `FREQUENCY 33120A` - *frequency - 20000* (Hz)
- `DUTY 33120A` - *duty - 60* (%)
- `AMPLITUDE 33120A` - *amplitude - 0.2* (Vpp)
- `OFFSET 33120A` - *offset - 0.15* (V)
- `SAVE 33120A`
- `RECALL 33120A`
- `ERRORS 33120A` - *number - 5*
- `TEXT VIEW`

If no parameters are specified they were left at default settings. The instrument address was set for each instrument block to the corrent COM port.

The `CLEAR BUFFER 33120A` and `RESET 33120A` blocks can be important to prevent some errors such as a buffer overflow. The impedance, trigger, volt unit, frequency, duty, amplitude, and offset blocks all set parameters corresponding to the output function. The `ERRORS 33120A` will return any errors in the instrument's buffer (first in first out).

The blocks were connected as shown and the app was run. The `SAVE 33120A` block can be used to save the current state of the instrument. When you wish the recall those setting you can use the `RECALL 33120A` block. `RECALL 33120A` can replace all blocks in the app except `OPEN_SERIAL`, `CLEAR BUFFER 33120A`, `RESET 33120A`, and `ERRORS 33120A` (as long as the settings are saved).
