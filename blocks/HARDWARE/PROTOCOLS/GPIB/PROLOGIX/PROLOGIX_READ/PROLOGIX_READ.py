import serial
from flojoy import flojoy, SerialConnection, DataContainer, String
from typing import cast, Optional, Literal


@flojoy(inject_connection=True)
def PROLOGIX_READ(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
) -> String:
    """Returns the response from the GPIB instrument.

    For example if you query a VISA instrument with "*IDN?\n" using a
    SERIAL_WRITE block, this block must be used to return the response.

    Not required if the PROLOGIX_AUTO setting is "on" (not recommended).

    Requires an OPEN_SERIAL block.

    Inputs
    ------
    default: DataContainer
        Any DataContainer

    Parameters
    ----------
    connection: Serial
        The open serial connection with the instrument.

    Returns
    -------
    String
        Response from the Prologix USB-to-GPIB controller.
    """

    # Start serial communication with the instrument
    ser = cast(serial.Serial, connection.get_handle())

    if ser is None:
        raise ValueError("Serial communication is not open")

    cmd = "++read eoi\n"
    ser.write(cmd.encode())
    s = ser.read(256)
    if isinstance(s, bytes):
        s = s.decode("utf-8")

    return String(s)
