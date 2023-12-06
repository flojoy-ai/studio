from flojoy import OrderedPair, flojoy


@flojoy()
def LM34(
    default: OrderedPair,
    calibration1: float = 100.0,
    calibration2: float = 32.0,
    calibration3: float = 1.8,
) -> OrderedPair:
    """Convert voltages measured with a thermocouple (LM34) connected to a LabJack U3 device into temperature units.

    Parameters
    ----------
    default : OrderedPair, optional

    calibration1, calibration2, calibration3 : float
        Calibration parameters to convert voltage into temperature in Celsius.

    Returns
    -------
    OrderedPair
        The output of the node is a list of temperatures measured from the sensors.
    """

    temperatures_celsius: list[float] = []
    voltages = default.y
    sensor_num = default.x
    sensors_number = len(default.x)

    # Convert Voltage into temperature in Celsius :
    for i in range(0, sensors_number):
        temperature: float = voltages[i] * calibration1
        temperature_celsius: float = (temperature - calibration2) / calibration3
        temperatures_celsius.append(temperature_celsius)

    return OrderedPair(sensor_num, temperatures_celsius)
