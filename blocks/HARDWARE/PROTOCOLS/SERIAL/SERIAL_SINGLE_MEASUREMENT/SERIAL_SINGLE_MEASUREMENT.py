from typing import Optional
from numpy import array
from flojoy import Vector, SerialDevice, flojoy, DataContainer


@flojoy(inject_connection=True)
def SERIAL_SINGLE_MEASUREMENT(
    connection: SerialDevice,
    default: Optional[DataContainer] = None,
) -> Vector:
    """Takes a single reading of data from a serial device (e.g. Arduino).

    If the data is comma seperated (e.g. 25,26,27) with multiple measurements,
    a Vector is returned. You should use the VECTOR_INDEXING node to choose
    the specific measurement you want.

    Parameters
    ----------
    device : SerialDevice
        Defines the communication port on which the serial device is connected.

    Returns
    -------
    Vector
        The output from the serial device.
    """

    ser = connection.get_handle()

    s = ""
    while s == "":
        s = ser.readline().decode()

    reading = s[:-2].split(",")
    reading = array(reading)  # Create an array
    reading = reading.astype("float64")  # Convert the array to float

    ser.flush()

    return Vector(v=reading)
