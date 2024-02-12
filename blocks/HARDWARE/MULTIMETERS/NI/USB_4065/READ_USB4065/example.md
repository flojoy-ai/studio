In this example, a four wire resistance measurement is made with a NI USB-4065 digital multimeter.

Place the blocks:

- `CONNECTION USB4065`
- `RESISTANCE 4W USB4065`
- `READ USB4065`
- `BIG NUMBER`

First ensure the 4065 blocks have the correct instrument set in the parameters. Run the app to perform a reading.

Note the `RESISTANCE 4W USB4065` block has an optional parameter to take a single reading. However, the `READ USB4065` block can be used to make the same measurement multiple times without changing any settings.
