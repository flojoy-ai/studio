import traceback
from typing import Optional, cast

import serial
from flojoy import DataContainer, Scalar, SerialConnection, String, flojoy


@flojoy(deps={"pyserial": "3.5"}, inject_connection=True)
def MEASURE_VOLTAGE(
    connection: SerialConnection, default: Optional[DataContainer] = None
) -> Scalar | String:
    """Query an instrument's measured output voltage, such as a DMM or power supply.

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
    Scalar|String
        The measured voltage as a Scalar or an exception error as a String.
    """

    # Start serial communication with the instrument
    set = cast(serial.Serial, connection.get_handle())

    if set is None:
        raise ValueError("Serial communication is not open")

    CMD = "MEASURE:VOLTAGE:DC?\n\r"

    set.write(CMD.encode())

    resp = set.readline().decode()

    try:
        resp = float(resp.rstrip("\n"))
    except Exception:
        print(
            "Could not convert instrument response to a float", traceback.format_exc()
        )
        return String(resp)

    return Scalar(resp)
