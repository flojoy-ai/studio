from flojoy import flojoy, DataContainer, VisaConnection
from typing import Optional


@flojoy(inject_connection=True)
def DISPLAY_ON_OFF_T3DSO1XXX(
    connection: VisaConnection,
    display_ch1: bool = True,
    display_ch2: bool = True,
    display_ch3: bool = True,
    display_ch4: bool = True,
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
    display_ch1: select
        Turn channel 1 on or off
    display_ch2: select
        Turn channel 2 on or off
    display_ch3: select
        Turn channel 3 on or off
    display_ch4: select
        Turn channel 4 on or off

    Returns
    -------
    Optional[DataContainer]
        None
    """

    scope = connection.get_handle()

    scope.write(f"C1:TRACE {'ON' if display_ch1 else 'OFF'}")
    scope.write(f"C2:TRACE {'ON' if display_ch2 else 'OFF'}")
    scope.write(f"C3:TRACE {'ON' if display_ch3 else 'OFF'}")
    scope.write(f"C4:TRACE {'ON' if display_ch4 else 'OFF'}")

    return None
