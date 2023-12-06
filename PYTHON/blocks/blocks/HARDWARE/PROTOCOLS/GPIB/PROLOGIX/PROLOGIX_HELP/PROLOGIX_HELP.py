import traceback
from typing import Optional, cast

import serial
from flojoy import DataContainer, SerialConnection, String, flojoy


@flojoy(deps={"pyserial": "3.5"}, inject_connection=True)
def PROLOGIX_HELP(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
) -> String:
    """Return a list of available Prologix USB-to-GPIB firmware commands.

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
        A list of available Prologix USB-to-GPIB firmware commands
    """

    try:
        # Start serial communication with the instrument
        set = cast(serial.Serial, connection.get_handle())
        if set is None:
            raise ValueError("Serial communication is not open")
        set.write(b"++help\r\n")
        s = set.read(1000).decode()
    except Exception:
        s = traceback.format_exc()

    return String(s)
