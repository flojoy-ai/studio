This app uses the Tektronix tm_measure library to load a setup file and extract curves from a Tektronix MSO24 oscilloscope.

A setup file in MSO24 can store most of the instruments settings including axis scales, trigger settings, etc. The settings must already be stored for this example app.

First the necessary blocks were added:

- 1 `CONNECT_MSO2X`
- 1 `SETUP_FILE_MSO2X`
- 1 `AFG_MSO2X`
- 3 `QUERY_CURVE_MSO2X`
- 3 `LINE`

Each of these blocks must change the `connection` parameter to the correct instrument. The `SETUP_FILE_MSO2X` can be set to recall `flojoy` as a filename (this recalls the file located at `c:/flojoy.set`).

The three `QUERY_CURVE_MSO2X` blocks were set to channel 1, 2, and 3 (one each).

Note that the AFG settings are not loaded from the setup file.
Note two inputs (CH2 and CH3) came from an external source.
