from typing import Optional, Literal
from flojoy import String, SerialDevice, flojoy, DataContainer


@flojoy(inject_connection=True)
def SERIAL_WRITE(
    connection: SerialDevice,
    write: str = "",
    encoding: Literal["bytes", "utf-8", "ascii"] = "bytes",
    terminator: Literal["CR+LF", "CR", "LF", "None"] = "None",
    default: Optional[DataContainer] = None,
) -> String:
    """Write a custom string to the selected serial device.

    Parameters
    ----------
    device : SerialDevice
        Defines the communication port on which the serial device is connected.
    write : str
        The string to write to the serial device.
    encoding : select
        Which string encoding method to use.

    Returns
    -------
    String
        The input string.
    """

    ser = connection.get_handle()

    match terminator:
        case "CR+LF":
            terminator = "\r\n"
        case "CR":
            terminator = "\r"
        case "LF":
            terminator = "\n"
        case "None":
            terminator = ""

    write += terminator

    match encoding:
        case "bytes":
            ser.write(write.encode())
        case "utf-8":
            ser.write(write)
        case "ascii":
            ser.write(write.encode(encoding="ascii"))

    return String(s=write)
