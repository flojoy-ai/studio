This app uses the Tektronix tm_measure library to create a steup file for a Tektronix MSO24 oscilloscope.

A setup file in MSO24 can store most of the instruments settings including axis scales, trigger settings, etc. To store the settings Flojoy blocks must first be used to create the inital settings.

First the necessary blocks were added:

- 1 `CONNECT_MSO2X`
- 1 `AFG_MSO2X`
- 1 `CHANNEL_DISPLAY_MSO2X`
- 1 `EDGE_TRIGGER_MSO2X`
- 1 `HORIZONTAL_SCALE_MSO2X`
- 3 `VERTICAL_SCALE_MSO2X`
- 3 `PROBE_ATTENUATION_MSO2X`
- 1 `SETUP_FILE_MSO2X`

Each of these blocks must change the `connection` parameter to the correct instrument. The `channel` parameter for the 3 `VERTICAL_SCALE_MSO2X` blocks must be changed to channel 1, 2, and 3 (i.e. one each). The same is true for `PROBE_ATTENUATION_MSO2X`. Additionally the three channels can be turned on with the `CHANNEL_DISPLAY_MSO2X` block.

The `SETUP_FILE_MSO2X` can be set to save `flojoy` as a filename (this saves the file located at `c:/flojoy.set`).

Note that the AFG settings are not loaded from the setup file.
Note two inputs (CH2 and CH3) came from an external source.
