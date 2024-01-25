This app prepares the Prologix GPIB-USB adapter for use with a VISA instrument. The user can then send a SCPI command to a VISA instrument using the GPIB-USB adapter.

Parameters:
- Connection on all of the Blocks should be the COM port of the adapter.
- `PROLOGIX AUTO`: auto = off
- `PROLOGIX MODE`: mode = CONTROLLER
- `PROLOGIX EOI`: EOI = true, EOS = None (instrument dependent)
- GPIB address should match the instrument's (see the instrument's manual on how to find it)
- `OPEN SERIAL`: writing "*IDN?" with bytes encoding and a LF terminator

This app has two rows that are run seperately:
1. The top, setup, row with `AUTO`, `MODE` and `EOI` blocks.
2. The bottom row with `WRITE` and `READ`.

The two constants on the bottom left control which row runs. If they are equal, the setup row runs. Otherwise, the read/write row runs. The setup should be run _before_ connecting the adapter to the instrument.

Note that the `PROLOGIX READ` should be used to recieve a response from the instrument. The AUTO mode can be turned on which recieves a response upon every command (`PROLOGIX AUTO` block controls this setting). However, this causes errors in some VISA instruments.
