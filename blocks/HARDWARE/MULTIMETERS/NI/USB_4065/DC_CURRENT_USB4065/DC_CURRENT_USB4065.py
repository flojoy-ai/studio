from flojoy import flojoy, DataContainer, Scalar, NIConnection
from typing import Optional, Literal
import nidmm


@flojoy(inject_connection=True)
def DC_CURRENT_USB4065(
    connection: NIConnection,
    digits: Literal["4.5", "5.5", "6.5"] = "5.5",
    current_limit: Literal["0.01", "0.1", "0.5", "3"] = "3",
    read: bool = False,
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Sets the measurement mode to DC current for a NI USB-4065 DMM.

    Also optionally reads the selected unit. You can also use the READ_USB4065
    block to read the selected unit in a separate block.

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
    current_limit: select
        The maximum current to allow, in Amps.
    read: bool
        Read the selected unit, or not.

    Returns
    -------
    DataContainer
        Scalar: The DC current reading.
    """

    session = connection.get_handle()

    session.configure_measurement_digits(
        nidmm.Function.DC_CURRENT,
        range=float(current_limit),
        resolution_digits=float(digits),
    )

    if read:
        return Scalar(c=session.read())

    return None
