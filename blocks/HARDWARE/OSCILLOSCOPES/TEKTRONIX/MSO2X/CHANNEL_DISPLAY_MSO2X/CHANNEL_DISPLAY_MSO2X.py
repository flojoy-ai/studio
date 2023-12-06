from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def CHANNEL_DISPLAY_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    ch1_display: Literal["1", "0"] = "0",
    ch2_display: Literal["1", "0"] = "0",
    ch3_display: Literal["1", "0"] = "0",
    ch4_display: Literal["1", "0"] = "0",
) -> String:
    """Set the MSO2XX channels on (1) or off (0).

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    ch1_display : select, default=0
        Turn the channel on or off
    ch2_display : select, default=0
        Turn the channel on or off
    ch3_display : select, default=0
        Turn the channel on or off
    ch4_display : select, default=0
        Turn the channel on or off

    Returns
    -------
    String
        Channel display
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    scope.set_and_check("DISplay:GLObal:CH1:STATE", ch1_display)
    scope.set_and_check("DISplay:GLObal:CH2:STATE", ch2_display)
    scope.set_and_check("DISplay:GLObal:CH3:STATE", ch3_display)
    scope.set_and_check("DISplay:GLObal:CH4:STATE", ch4_display)

    return String(s="Channel display")
