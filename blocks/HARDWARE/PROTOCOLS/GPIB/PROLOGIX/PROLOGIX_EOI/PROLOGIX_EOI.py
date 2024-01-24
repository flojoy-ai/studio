import serial
from flojoy import flojoy, SerialConnection, DataContainer, String
from typing import cast, Optional, Literal


@flojoy(inject_connection=True)
def PROLOGIX_EOI(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
    eoi: bool = True,
    eos: Literal["CR+LF", "CR", "LF", "None"] = "None",
) -> String:
    """Sets the EOI and EOS settings for the Prologix GPIB-USB adapter.

    Only used for the GPIB port (not the serial port).

    EOI - end of interrupt (use terminator or not)
    EOS - end of string (termination character)

    Requires an OPEN_SERIAL block.

    Parameters
    ----------
    connection: Serial
        The open serial connection with the instrument.
    eoi: bool
        Use EOI (1) or not (0).
    eos: select
        Which terminator to use.

    Returns
    -------
    String
        Response from the Prologix USB-to-GPIB controller.
    """

    # Start serial communication with the instrument
    ser = cast(serial.Serial, connection.get_handle())

    if ser is None:
        raise ValueError("Serial communication is not open")

    if eoi:
        cmd = 1
    else:
        cmd = 0

    match eos:
        case "CR+LF":
            eos = 0
        case "CR":
            eos = 1
        case "LF":
            eos = 2
        case "None":
            eos = 3

    ser.write(str(cmd).encode())

    cmd = f"++eos {eos}\n"
    ser.write(cmd.encode())
    s = ser.read(256)

    return String(s)
