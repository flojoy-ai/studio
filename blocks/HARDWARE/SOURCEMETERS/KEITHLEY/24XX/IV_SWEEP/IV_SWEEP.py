from typing import cast

import numpy as np
import serial
from flojoy import OrderedPair, SerialConnection, Vector, flojoy


@flojoy(deps={"pyserial": "3.5"}, inject_connection=True)
def IV_SWEEP(
    connection: SerialConnection, default: OrderedPair | Vector
) -> OrderedPair:
    """Take an I-V curve measurement with a Keithley 2400 source meter (send voltages, measure currents).

    Parameters
    ----------
    default: OrderedPair | Vector
        The voltages to send to the Keithley 2400 source meter.
    connection: Serial
        The open connection with the Keithley 2400 source meter.

    Returns
    -------
    OrderedPair
    """

    # Start serial communication with the instrument
    ser = cast(serial.Serial, connection.get_handle())

    if ser is None:
        raise ValueError("Serial communication is not open")

    # Keithley 2400 Configuration
    ser.write(b"*RST\n")  # reinitialisation of the instrument
    ser.write(
        b":SOUR:FUNC:MODE VOLT\n"
    )  # Sourcing tension ser.write(b':SENS:FUNC "CURR"\n')  # Measuring current
    ser.write(
        b":SENS:CURR:PROT 1.05\n"
    )  # Current protection set at 1.05A (Keithley 2400)

    match default:
        case OrderedPair():
            voltages = default.y
        case Vector():
            voltages = default.v

    currents_neg: list[float] = []  # measured currents

    for voltage in voltages:
        ser.write(b":SOUR:VOLT %f\n" % voltage)  # Source Tension (V)
        ser.write(b":OUTP ON\n")  # Instrument output open
        ser.write(b":INIT\n")  # Start measuring
        ser.write(b":FETC?\n")  # Retrieve the measured values

        current_str = ser.readline().decode("ascii").strip()  # Save answers in a string
        voltage_current_values = current_str.split(",")  # Split the string
        currents_neg.append(-float(voltage_current_values[1]))

        ser.write(b":OUTP OFF\n")  # Close output from Instrument

    # Close Serial Communication
    ser.close()

    return OrderedPair(x=voltages, y=np.array(currents_neg))
