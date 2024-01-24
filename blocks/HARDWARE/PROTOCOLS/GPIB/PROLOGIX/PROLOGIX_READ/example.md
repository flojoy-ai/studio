This app shows how to send a SCPI command to a VISA instrument using the Prologix GPIB-USB adapter.

Parameters
- Ensure the connection for all blocks is the same COM port as the GPIB adapter
- `OPEN SERIAL`: writing "*IDN?" with bytes encoding and a LF terminator

Note that the `PROLOGIX READ` must be used to recieve a response from the instrument. The AUTO mode can be turned on which recieves a response upon every command (`PROLOGIX AUTO` block controls this setting). However, this causes errors in some VISA instruments. 
