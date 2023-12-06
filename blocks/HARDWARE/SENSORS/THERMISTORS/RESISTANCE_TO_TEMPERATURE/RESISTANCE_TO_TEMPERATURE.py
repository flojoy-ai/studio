from typing import Literal
from flojoy import Scalar, flojoy
from numpy import log


@flojoy
def RESISTANCE_TO_TEMPERATURE(
    default: Scalar,
    unit: Literal["K", "C", "F"] = "K",
    nominal_resistance: float = 1e4,
    nominal_temperature: float = 298.15,
    beta_coefficient: float = 3950,
) -> Scalar:
    """The RESISTANCE_TO_TEMPERATURE node converts resistance to temperature.

    The resistance should be a reading from a thermistor in Ohms.

    Parameters
    ----------
    unit: select
        Which unit of temperature to return.

    Returns
    -------
    Scalar
        The resulting temperature.
    """

    steinhart = log(default.c / nominal_resistance)  # X = ln(R/Ro)
    steinhart /= beta_coefficient  # X / B
    steinhart += 1.0 / (nominal_temperature)  # X + (1/To)
    kelvin = 1.0 / steinhart  # 1 / X
    celsius = kelvin - 273.15
    fahren = celsius * 9 / 5 + 32

    match unit:
        case "K":
            c = kelvin
        case "C":
            c = celsius
        case "F":
            c = fahren

    return Scalar(c=c)
