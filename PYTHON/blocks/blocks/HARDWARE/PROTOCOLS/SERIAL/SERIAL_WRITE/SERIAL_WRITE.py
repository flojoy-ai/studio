from typing import Optional, Literal
from flojoy import TextBlob, SerialDevice, flojoy, DataContainer


@flojoy(inject_connection=True)
def SERIAL_WRITE(
    connection: SerialDevice,
    write: str = "",
    encoding: Literal["bytes", "utf-8", "ascii"] = "bytes",
    default: Optional[DataContainer] = None,
) -> TextBlob:
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
    TextBlob
        The input string.
    """

    ser = connection.get_handle()

    match encoding:
        case "bytes":
            ser.write(bytes(write, encoding="utf8"))
        case "utf-8":
            ser.write(write)
        case "ascii":
            ser.write(write.encode(encoding="ascii"))

    return TextBlob(text_blob=write)
