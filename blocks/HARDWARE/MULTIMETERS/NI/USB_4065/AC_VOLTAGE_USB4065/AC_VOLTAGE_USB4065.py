from flojoy import flojoy, DataContainer, Scalar, NIConnection
from typing import Optional, Literal
import nidmm


@flojoy(inject_connection=True)
def AC_VOLTAGE_USB4065(
    connection: NIConnection,
    digits: Literal["4.5", "5.5", "6.5"] = "5.5",
    voltage_limit: Literal["0.2", "2", "20", "300"] = "20",
    read: bool = False,
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Sets the measurement mode to AC voltage for a NI USB-4065 DMM.

    Also optionally reads the selected unit. You can also use the READ_USB4065
    block to read the selected unit in a separate block.

    Requires a CONNECTION_USB4065 block to connect Flojoy to the instrument.

    The USB-4065 is a NI (National Instruments) multimeter. It is possible
    that the block will work with other NI DMMs (digital multimeters) such
    as the 4070 and 4080 series.

    This instrument will likely only be compatible with Windows systems due to
    NI driver availablity. To use the instrument you must install the runtime:

    https://www.ni.com/en/support/downloads/drivers/download.ni-dmm.html

    Parameters
    ----------
    NI_address: NIConnection
        The NI instrument.
    digits: select
        The number of digits for the measurement. Lower values are faster.
    voltage_limit: select
        The maximum voltage to allow, in Volts.
    read: bool
        Read the selected unit, or not.

    Returns
    -------
    DataContainer
        Scalar: The AC voltage reading.
    """

    session = connection.get_handle()

    session.configure_measurement_digits(
        nidmm.Function.AC_VOLTS,
        range=float(voltage_limit),
        resolution_digits=float(digits),
    )

    if read:
        return Scalar(c=session.read())

    return None
