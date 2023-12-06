import serial
from typing import Optional
from flojoy import SerialDevice, flojoy, DataContainer
from flojoy.connection_manager import DeviceConnectionManager


@flojoy(deps={"pyserial": "3.5"})
def OPEN_KEITHLEY_24XX(
    device: SerialDevice, baudrate: int = 9600
) -> Optional[DataContainer]:
    """Open a connection to the Keithley 2400 source meter.

    Parameters
    ----------
    device: Serial
        The connected serial device corresponding to the Keithley 2400 source meter.

    Returns
    -------
    None
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

    return None
