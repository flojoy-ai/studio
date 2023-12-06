import serial
from flojoy import flojoy, SerialConnection, DataContainer, String
from typing import cast, Optional


@flojoy(deps={"pyserial": "3.5"}, inject_connection=True)
def PROLOGIX_ADDR(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
    addr: int = 22,
) -> String:
    """Set the GPIB address of an instrument using the Prologix USB-to-GPIB or USB-to-Ethernet adapter.

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

    cmd = "++addr " + str(addr) + "\r\n"
    ser.write(cmd.encode())

    s = ser.read(256)

    return String(s)
