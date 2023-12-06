from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(inject_connection=True)
def DIGITS_DMM7510(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    digits: Literal["3.5", "4.5", "5.5", "6.5", "7.5"] = "7.5",
) -> String:
    """Changes the number of digits for measurements for the DMM7510.

    Less digits is faster (but less accurate).

    Requires a CONNECT_DMM7510 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_DMM7510 block).
    digits : select, default=7.5,
        Number of digits for the DMM measurements?

    Returns
    -------
    String
        Measurement settings
    """

    dmm = connection.get_handle()

    match digits:
        case "3.5":
            dmm.commands.dmm.measure.displaydigits = "dmm.DIGITS_3_5"
        case "4.5":
            dmm.commands.dmm.measure.displaydigits = "dmm.DIGITS_4_5"
        case "5.5":
            dmm.commands.dmm.measure.displaydigits = "dmm.DIGITS_5_5"
        case "6.5":
            dmm.commands.dmm.measure.displaydigits = "dmm.DIGITS_6_5"
        case "7.5":
            dmm.commands.dmm.measure.displaydigits = "dmm.DIGITS_7_5"

    return String(s=f"Digits: {digits}")
