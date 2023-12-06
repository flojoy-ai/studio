from flojoy import flojoy, DataContainer, TextBlob
from typing import Optional, Literal
from qcodes_contrib_drivers.drivers.Vaunix.LDA import Vaunix_LDA
import platform
from numpy import allclose
from os import path


@flojoy(deps={"qcodes-contrib-drivers": "0.18.0"})
def ATTENUATION_LDA602(
    serial_number: int = 839,
    query_set: Literal["query", "set"] = "query",
    attenuation: float = 10.0,
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """Set or query the attenuation for the LDA-602 Digital Attenuator.

    When setting the attenuation, the attenuation is then queried to ensure
    the attenuation was set correctly.
    The attenuation is rounded to the nearest 0.5 dB.

    This node should also work with compatible LDA attenuators (untested).

    Parameters
    ----------
    serial_number: str
        The serial number (not model number) to connect to.
    query_set: str
        Query or set the attenuation?
    attenuation: str
        The attenuation to set the LDA to, in dB.

    Returns
    -------
    DataContainer
        TextBlob: The current attenuation value.
    """

    assert (
        platform.system() == "Windows" and platform.architecture()[0] == "64bit"
    ), "This node currently supports only 64bit Windows."

    driver_path = path.dirname(__file__)

    assert path.isfile(
        path.join(driver_path, "VNX_atten64.dll")
    ), f"Ensure the dll file is placed here: {driver_path}"

    if query_set == "set":
        assert (
            0.0 <= attenuation <= 63.0
        ), f"The attenuation must be between 0 and 63 (set point: {attenuation})."

    attenuator = Vaunix_LDA("LDA", serial_number, dll_path=driver_path)

    match query_set:
        case "query":
            result = round(attenuator.attenuation() * 5, 2)
            s = f"Set to {round(attenuator.attenuation() * 5, 2)} dB"
        case "set":
            attenuator.attenuation(attenuation)
            result = round(attenuator.attenuation() * 5, 2)

            assert allclose(
                result, attenuation, rtol=0.1
            ), f"Resulting attenuation {result} is far from the set point {attenuation}"

            s = f"Set to {result} dB"

    attenuator.close()

    return TextBlob(text_blob=s)
