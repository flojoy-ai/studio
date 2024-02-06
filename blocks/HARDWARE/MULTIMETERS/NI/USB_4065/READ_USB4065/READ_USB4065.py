from flojoy import flojoy, DataContainer, Scalar, NIConnection
from typing import Optional


@flojoy(inject_connection=True)
def READ_USB4065(
    connection: NIConnection,
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Reads a measurement from a NI USB-4065 DMM.

    Pair with a block setting the measurement unit (e.g. DC_VOLTAGE_USB4065).

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

    Returns
    -------
    DataContainer
        Scalar: The DMM reading.
    """

    session = connection.get_handle()
    return Scalar(c=session.read())
