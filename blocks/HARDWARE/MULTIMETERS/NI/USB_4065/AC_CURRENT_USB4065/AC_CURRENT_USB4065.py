from flojoy import flojoy, DataContainer, Scalar
from flojoy.connection_manager import DeviceConnectionManager
from typing import Optional, Literal
import nidmm


@flojoy(deps={"nidmm": "1.4.6"})
def AC_CURRENT_USB4065(
    NI_address: str = "Dev1",
    digits: Literal["4.5", "5.5", "6.5"] = "5.5",
    current_limit: Literal["0.01", "0.1", "0.5", "3"] = "3",
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Reads the AC current from a National Instrument's USB-4065 DAQ board.

    The USB-4065 is a NI (National Instruments) multimeter. It is possible that
    the block will work with other NI DMMs (digital multimeters) such as the
    4070 and 4080 series.

    This instrument will likely only be compatible with Windows systems due to
    NI driver availablity. To use the instrument you must install the runtime:

    https://www.ni.com/en/support/downloads/drivers/download.ni-dmm.html

    You must also find the address/resource name for the instrument. You can
    find this using the NI MAX programming which can be downloaded when
    installing the drivers.

    Parameters
    ----------
    NI_address: str
        The NI instrument address for the instrument (e.g. 'Dev0', 'Dev1').
    digits: str
        The accuracy of the reading in digits. Lower values are faster.
    current_limit: str
        The maximum current to allow, in Amps.

    Returns
    -------
    DataContainer
        Scalar: The AC current reading.
    """

    connection = DeviceConnectionManager.get_connection(NI_address)
    session = connection.get_handle()

    session.configure_measurement_digits(
        nidmm.Function.AC_CURRENT,
        range=float(current_limit),
        resolution_digits=float(digits),
    )

    reading = session.read()

    return Scalar(c=reading)
