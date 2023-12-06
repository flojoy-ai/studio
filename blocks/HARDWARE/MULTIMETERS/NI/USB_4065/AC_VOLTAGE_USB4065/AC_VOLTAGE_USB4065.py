from flojoy import flojoy, DataContainer, Scalar
from flojoy.connection_manager import DeviceConnectionManager
from typing import Optional, Literal
import nidmm


@flojoy(deps={"nidmm": "1.4.6"})
def AC_VOLTAGE_USB4065(
    NI_address: str = "Dev1",
    digits: Literal["4.5", "5.5", "6.5"] = "5.5",
    voltage_limit: Literal["0.2", "2", "20", "300"] = "20",
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Read the AC voltage from a National Instrument's USB-4065 DAQ board.

    The USB-4065 is a NI (National Instruments) multimeter. It is possible that
    the node will work with other NI DMMs (digital multimeters) such as the
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
    voltage_limit: str
        The maximum voltage to allow, in Volts.

    Returns
    -------
    DataContainer
        Scalar: The AC voltage reading.
    """

    connection = DeviceConnectionManager.get_connection(NI_address)
    session = connection.get_handle()

    session.configure_measurement_digits(
        nidmm.Function.AC_VOLTS,
        range=float(voltage_limit),
        resolution_digits=float(digits),
    )

    reading = session.read()

    return Scalar(c=reading)
