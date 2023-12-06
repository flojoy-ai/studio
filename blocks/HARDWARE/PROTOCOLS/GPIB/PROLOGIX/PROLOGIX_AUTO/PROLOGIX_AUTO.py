import serial
from flojoy import flojoy, SerialConnection, DataContainer, String
from typing import cast, Optional, Literal


@flojoy(deps={"pyserial": "3.5"}, inject_connection=True)
def PROLOGIX_AUTO(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
    auto: Literal["On", "Off", "Current state"] = "Current state",
) -> String:
    """Toggle "Read-After-Write" mode on or off.

    When Read-After-Write is on, the Prologix USB-to-GPIB controller automatically reads a bench-top instrument's response after writing a command to it.

    Inputs
    ------
    default: DataContainer
        Any DataContainer - likely connected to the output of the OPEN_SERIAL block.

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

    auto_integer = 0
    if auto == "Current state":
        ser.write(b"++auto\r\n")
    elif auto == "On":
        auto_integer = 1
    else:
        cmd = "++auto " + str(auto_integer) + "\r\n"
        ser.write(cmd.encode())

    s = ser.read(256)

    return String(s)
