from datetime import datetime
from time import sleep
from typing import Optional

import numpy as np
import serial
from flojoy import OrderedPair, flojoy


@flojoy(deps={"pyserial": "3.5"})
def SERIAL_TIMESERIES(
    default: Optional[OrderedPair] = None,
    comport: str = "/dev/ttyUSB0",
    baudrate: int = 9600,
    num_readings: int = 100,
    record_period: int = 1,
) -> OrderedPair:
    """Extract simple, time-dependent 1D data from an Arduino or a similar serial device.

    Parameters
    ----------
    num_readings : int
        Number of points to record.
    record_period : float
        Length between two recordings in seconds.
    baudrate : int
        Baud rate for the serial device.
    comport : string
        COM port of the serial device.

    num_readings * record_period :
        Is roughly the run length in seconds.

    Returns
    -------
    OrderedPair
    """

    set = serial.Serial(comport, timeout=1, baudrate=baudrate)
    readings = []
    times = []
    # The first reading is commonly empty.
    s = set.readline().decode()

    for i in range(num_readings):
        ts = datetime.now()
        s = set.readline().decode()
        # Some readings may be empty.
        if s != "":
            reading = s[:-2].split(",")
            if len(reading) == 1:
                reading = reading[0]
            readings.append(reading)

            ts = datetime.now()
            seconds = float(
                ts.hour * 3600 + ts.minute * 60 + ts.second + ts.microsecond / 10**6
            )

            times.append(seconds)

            if len(times) > 0:
                time1 = seconds - times[i]
            else:
                # Estimate execution time.
                time1 = 0.1

            if time1 < record_period:
                sleep(record_period - time1)

    times = np.array(times)
    try:
        times -= times[0]
    except IndexError:
        raise IndexError("No data detected from the Arduino")

    readings = np.array(readings)
    readings = readings.astype("float64")

    return OrderedPair(x=times, y=readings)
