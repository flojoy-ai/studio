from flojoy import flojoy, DataContainer, Scalar, VisaConnection
from typing import Optional


@flojoy(inject_connection=True)
def MEASURE_PHASE_MDO3XXX(
    connection: VisaConnection,
    channel1: int = 0,
    channel2: int = 1,
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Measure the phase between two channels on an MDO3XXX oscilloscope.

    Requires a CONNECTION_MDO3XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible Tektronix scopes (untested):
    MDO4xxx, MSO4xxx, and DPO4xxx.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX block).
    channel1: int
        The first channel.
    channel2: int
        The second channel.

    Returns
    -------
    DataContainer
        Scalar: The phase between the two channels.
    """

    assert channel1 != channel2, "The channels must not the same."

    tek = connection.get_handle()

    tek.measurement[0].source1(f"CH{int(channel1 + 1)}")
    tek.measurement[0].source2(f"CH{int(channel2 + 1)}")
    value = tek.measurement[0].phase()

    return Scalar(c=value)
