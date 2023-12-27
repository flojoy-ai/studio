from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def DIGITAL_CHANNELS_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    all_channels: bool = False,
    D0_display: Literal["1", "0"] = "0",
    D1_display: Literal["1", "0"] = "0",
    D2_display: Literal["1", "0"] = "0",
    D3_display: Literal["1", "0"] = "0",
    D4_display: Literal["1", "0"] = "0",
    D5_display: Literal["1", "0"] = "0",
    D6_display: Literal["1", "0"] = "0",
    D7_display: Literal["1", "0"] = "0",
    D8_display: Literal["1", "0"] = "0",
    D9_display: Literal["1", "0"] = "0",
    D10_display: Literal["1", "0"] = "0",
    D11_display: Literal["1", "0"] = "0",
    D12_display: Literal["1", "0"] = "0",
    D13_display: Literal["1", "0"] = "0",
    D14_display: Literal["1", "0"] = "0",
    D15_display: Literal["1", "0"] = "0",
) -> String:
    """Set the digital MSO2XX channels on (1) or off (0).

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    all_channels : bool, default=False
        Turn all channels on? The display parameters aren't used if True.
    D0_display : select, default=0
        Turn the channel on (1) or off (0).
    D1_display : select, default=0
        Turn the channel on (1) or off (0).
    D2_display : select, default=0
        Turn the channel on (1) or off (0).
    D3_display : select, default=0
        Turn the channel on (1) or off (0).
    D4_display : select, default=0
        Turn the channel on (1) or off (0).
    D5_display : select, default=0
        Turn the channel on (1) or off (0).
    D6_display : select, default=0
        Turn the channel on (1) or off (0).
    D7_display : select, default=0
        Turn the channel on (1) or off (0).
    D8_display : select, default=0
        Turn the channel on (1) or off (0).
    D9_display : select, default=0
        Turn the channel on (1) or off (0).
    D10_display : select, default=0
        Turn the channel on (1) or off (0).
    D11_display : select, default=0
        Turn the channel on (1) or off (0).
    D12_display : select, default=0
        Turn the channel on (1) or off (0).
    D13_display : select, default=0
        Turn the channel on (1) or off (0).
    D14_display : select, default=0
        Turn the channel on (1) or off (0).
    D15_display : select, default=0
        Turn the channel on (1) or off (0).
    D16_display : select, default=0
        Turn the channel on (1) or off (0).

    Returns
    -------
    String
        Channel display
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    if all_channels:
        scope.write("DISplay:WAVEView1:DCH1_DALL:STATE 1")
    else:
        scope.write(f"DISplay:WAVEView1:DCH1_D0:STATE {D0_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D1:STATE {D1_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D2:STATE {D2_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D3:STATE {D3_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D4:STATE {D4_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D5:STATE {D5_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D6:STATE {D6_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D7:STATE {D7_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D8:STATE {D8_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D9:STATE {D9_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D10:STATE {D10_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D11:STATE {D11_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D12:STATE {D12_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D13:STATE {D13_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D14:STATE {D14_display}")
        scope.write(f"DISplay:WAVEView1:DCH1_D15:STATE {D15_display}")

    return String(s="Digital display")
