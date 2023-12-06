from typing import Optional
from flojoy import VisaConnection, flojoy, DataContainer, TextBlob


@flojoy(inject_connection=True)
def MEASUREMENT_PARAMS_DMM7510(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    autorange: bool = True,
    meas_range: float = 1,
    autozero: bool = True,
    count: int = 1,
    NPLC: float = 1,
) -> TextBlob:
    """Changes the measurement settings for the DMM7510.

    Requires a CONNECT_DMM7510 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_DMM7510 block).
    autorange: bool, default=True,
        Use auto range?
    meas_range : float, default=1,
        The range to measure with (i.e. the maximum).
    autozero : bool, default=True,
        Use auto zero?
    count : int, default=1,
        The number of counts to average.
    NPLC : float, default=1,
        The integration rate in number of clocks.

    Returns
    -------
    TextBlob
        Measurement settings
    """
    assert count > 0, "The count must be greater than 1."

    dmm = connection.get_handle()

    dmm.commands.dmm.measure.range = meas_range
    if autorange:
        dmm.commands.dmm.measure.autorange = "dmm.ON"
    else:
        dmm.commands.dmm.measure.autorange = "dmm.OFF"
    if autozero:
        dmm.commands.dmm.measure.autozero.enable = "dmm.ON"
    else:
        dmm.commands.dmm.measure.autozero.enable = "dmm.OFF"
    dmm.commands.dmm.measure.nplc = NPLC
    dmm.commands.dmm.measure.count = count

    dmm.commands.dmm.measure.inputimpedance = "dmm.IMPEDANCE_AUTO"

    return TextBlob(text_blob=f"Measure range: {dmm.commands.dmm.measure.range}")
