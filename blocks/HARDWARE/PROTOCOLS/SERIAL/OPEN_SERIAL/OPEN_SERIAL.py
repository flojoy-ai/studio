import json
import serial
from flojoy import SerialDevice, flojoy, String
from flojoy.connection_manager import DeviceConnectionManager
from time import sleep


@flojoy(deps={"pyserial": "3.5"})
def OPEN_SERIAL(
    device: SerialDevice,
    baudrate: int = 9600,
    connection_time: float = 0,
) -> String:
    """Open a serial connection through your computer's USB or RS-232 port.

    Parameters
    ----------
    device: Serial
        The connected serial device.

    Returns
    -------
    String
    """

    ser = serial.Serial(
        port=device.get_port(),
        baudrate=baudrate,
        bytesize=serial.EIGHTBITS,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        timeout=1,
    )

    DeviceConnectionManager.register_connection(device, ser)

    if connection_time > 0:
        sleep(connection_time)

    return String(s=json.dumps(ser.get_settings()))
