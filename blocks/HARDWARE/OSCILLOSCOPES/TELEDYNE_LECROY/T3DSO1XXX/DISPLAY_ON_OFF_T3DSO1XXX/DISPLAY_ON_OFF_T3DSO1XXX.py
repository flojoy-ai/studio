from flojoy import flojoy, DataContainer, VisaConnection
from typing import Literal, Optional


@flojoy(inject_connection=True)
def DISPLAY_ON_OFF_T3DSO1XXX(
    connection: VisaConnection,
    ch1: Literal["ON", "OFF"] = "ON",
    ch2: Literal["ON", "OFF"] = "ON",
    ch3: Literal["ON", "OFF"] = "ON",
    ch4: Literal["ON", "OFF"] = "ON",
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Turn the display of the channels on or off on an T3DSO1000(A)-2000 oscilloscope.

    Requires a CONNECT_T3DSO1XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should work with any Teledyne LeCroy T3DSO1000(A)-2000 series oscilloscope.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECT_T3DSO1XXX block)
    ch1: select
        Turn channel 1 on or off
    ch2: select
        Turn channel 2 on or off
    ch3: select
        Turn channel 3 on or off
    ch4: select
        Turn channel 4 on or off

    Returns
    -------
    Optional[DataContainer]
        None
    """

    scope = connection.get_handle()

    scope.write(f"C1:TRACE {ch1}")
    scope.write(f"C2:TRACE {ch2}")
    scope.write(f"C3:TRACE {ch3}")
    scope.write(f"C4:TRACE {ch4}")

    return None
