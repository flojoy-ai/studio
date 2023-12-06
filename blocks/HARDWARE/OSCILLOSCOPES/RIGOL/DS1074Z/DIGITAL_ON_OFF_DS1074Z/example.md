In this example the digital function blocks are used to control the `LA` channels of the Rigol DS1047Z oscilloscope.

A `CONNECTION_DS1047Z` block must first be used to make the connection between Flojoy and the instrument.

The `DIGITAL_ON_OFF_DS1047Z` block turns the `LA` digital channel off as well as indiviual sub-channels.

The `DIGITAL_TRIGGER_DS1047Z` block chooses the triggering digital channel (e.g. `D0 here`) and the triggering level.

The `SINGLE_TRIGGER_DS1047Z` block sets the triggering mode to `single` which stops the oscilloscope as soon as a triggering signal is detected, leaving a static trace on the screen.

The `DIGITAL_TRACE_DS1047Z` block extracts traces from digital channels such as `D0`.
