from typing import Optional, cast

import serial
from flojoy import DataContainer, Scalar, SerialConnection, TextBlob, flojoy


@flojoy(deps={"pyserial": "3.5"}, inject_connection=True)
def SCPI_WRITE(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
    command: str = "*IDN?",
) -> Scalar | TextBlob:
    """Write a SCPI command to a connected bench-top instrument and return the result.

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
    Scalar|TextBlob
        The return value from the bench-top instrument as a Scalar or TextBlob.
    """

    # Start serial communication with the instrument
    set = cast(serial.Serial, connection.get_handle())

    if set is None:
        raise ValueError("Serial communication is not open")

    CMD = command + "\n\r"

    set.write(CMD.encode())

    resp = set.readline().decode()

    try:
        resp = float(resp.rstrip("\n"))
    except Exception:
        return TextBlob(resp)

    return Scalar(resp)
