This app prepares the Prologix GPIB-USB adapter for use with a VISA instrument.

Parameters:
- Connection on all of the Blocks should be the COM port of the adapter.
- PROLOGIX AUTO: auto = off
- PROLOGIX MODE: mode = CONTROLLER
- PROLOGIX EOI: EOI = true, EOS = None
- GPIB address should match the instrument's

The app should be run _before_ connecting the adapter to the instrument.