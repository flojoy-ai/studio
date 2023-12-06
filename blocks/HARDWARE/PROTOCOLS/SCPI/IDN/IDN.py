import serial
from flojoy import flojoy, SerialConnection, String, DataContainer
from typing import cast, Optional


@flojoy(deps={"pyserial": "3.5"}, inject_connection=True)
def IDN(
    connection: SerialConnection, default: Optional[DataContainer] = None
) -> String:
    """Query a device's identity through the universal *IDN? SCPI command.

    Inputs
    ------
    default: DataContainer
        Any DataContainer - likely connected to the output of the OPEN_SERIAL block.

    Parameters
    ----------
    connection: Serial
        The open connection with the device receiving the *IDN? SCPI command.

    Returns
    -------
    String
        The result of the *IDN? SCPI command.
    """

    # Start serial communication with the instrument
    ser = cast(serial.Serial, connection.get_handle())

    if ser is None:
        raise ValueError("Serial communication is not open")

    ser.write("*IDN?\n".encode())

    return String(s=ser.readline().decode())
