import serial
from flojoy import flojoy, SerialConnection, DataContainer, TextBlob
from typing import cast, Optional, Literal


@flojoy(deps={"pyserial": "3.5"}, inject_connection=True)
def PROLOGIX_MODE(
    connection: SerialConnection,
    default: Optional[DataContainer] = None,
    mode: Literal["CONTROLLER", "DEVICE"] = "CONTROLLER",
) -> TextBlob:
    """Set the mode of the Prologix USB-to-GPIB controller - 1 for CONTROLLER mode and 0 for DEVICE mode.

    From the Prologix manual:

    In Controller mode, the GPIB-USB Controller acts as the Controller-In-Charge (CIC)
    on the GPIB bus. When the controller receives a command over the USB port
    terminated by the USB terminator – CR (ASCII 13) or LF (ASCII 10) – it addresses the
    GPIB instrument at the currently specified address (See ++addr command) to listen, and
    passes along the received data.

    In Device mode, Prologix GPIB-USB Controller acts as another peripheral on the GPIB
    bus. In this mode, the controller can act as a GPIB TALKER or GPIB LISTENER
    only. Since Prologix GPIB-USB Controller is not the Controller-In-Charge while in this
    mode, it expects to receive commands from a GPIB controller. When Device mode is
    enabled Prologix GPIB-USB controller configures itself as a GPIB Listener. All data
    received by the controller over the GPIB port is passed along to the USB port without
    buffering.

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
    TextBlob
        Response from the Prologix USB-to-GPIB controller.
    """

    # Start serial communication with the instrument
    ser = cast(serial.Serial, connection.get_handle())

    if ser is None:
        raise ValueError("Serial communication is not open")

    mode_integer = 0
    if mode == "CONTROLLER":
        mode_integer = 1

    cmd = "++mode " + str(mode_integer) + "\r\n"
    ser.write(cmd.encode())

    s = ser.read(256)

    return TextBlob(s)
