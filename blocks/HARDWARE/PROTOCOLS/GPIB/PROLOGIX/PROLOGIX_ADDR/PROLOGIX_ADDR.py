import serial
from flojoy import flojoy, SerialConnection, DataContainer, String
from typing import cast, Optional


@flojoy(inject_connection=True)
def PROLOGIX_ADDR(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
    addr: int = 10,
) -> String:
    """Set the GPIB address of the Prologix USB-to-GPIB adapter.

    This setting should match the address for the GPIB instrument.

    Requires an OPEN_SERIAL block.

    Parameters
    ----------
    connection: Serial
        The open serial connection with the instrument.
    addr: int
        The GPIB address.

    Returns
    -------
    String
        Response from the Prologix USB-to-GPIB controller.
    """

    # Start serial communication with the instrument
    ser = cast(serial.Serial, connection.get_handle())

    if ser is None:
        raise ValueError("Serial communication is not open")

    cmd = "++addr " + str(addr) + "\n"
    ser.write(cmd.encode())

    s = ser.read(256)

    return String(s)
