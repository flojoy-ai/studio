This app saves a screenshot on a MSO oscillioscope and extracts it to the local PC as well.

First the necessary blocks were added:

- 1 `CONNECT_MSO2X`
- 1 `SCREENSHOT_MSO2X`
- 1 `IMAGE`

Set the `connection` parameter to the correct instrument for the two MSO blocks. Choose paths and filenames where to store the screenshot for both the oscilloscope and your computer.

When you run the app you can also see the data is imported into Flojoy and is show on the `IMAGE` block.
