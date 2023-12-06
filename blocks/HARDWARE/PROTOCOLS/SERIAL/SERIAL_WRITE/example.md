In this example, serial commands are sent to an Arduino.

First the serial port must be opened with `OPEN_SERIAL`. 2 `TIMER` blocks were also added to add delays between the commands.

Three `WRITE_SERIAL` blocks are used to send commands to the Arduino. The first sends a command to turn on a red LED. The second turns off the red LED and turns a green LED on. The last block turns the green LED off.
