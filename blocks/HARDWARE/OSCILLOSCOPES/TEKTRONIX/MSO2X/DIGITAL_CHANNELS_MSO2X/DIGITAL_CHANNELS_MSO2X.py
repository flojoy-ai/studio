from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, String


def to_bit(channel):
    channel = 1 if channel else 0
    return channel


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def DIGITAL_CHANNELS_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    all_channels: bool = False,
    D0_display: bool = False,
    D1_display: bool = False,
    D2_display: bool = False,
    D3_display: bool = False,
    D4_display: bool = False,
    D5_display: bool = False,
    D6_display: bool = False,
    D7_display: bool = False,
    D8_display: bool = False,
    D9_display: bool = False,
    D10_display: bool = False,
    D11_display: bool = False,
    D12_display: bool = False,
    D13_display: bool = False,
    D14_display: bool = False,
    D15_display: bool = False,
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
        scope.write(f"DISplay:WAVEView1:DCH1_D0:STATE {to_bit(D0_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D1:STATE {to_bit(D1_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D2:STATE {to_bit(D2_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D3:STATE {to_bit(D3_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D4:STATE {to_bit(D4_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D5:STATE {to_bit(D5_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D6:STATE {to_bit(D6_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D7:STATE {to_bit(D7_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D8:STATE {to_bit(D8_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D9:STATE {to_bit(D9_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D10:STATE {to_bit(D10_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D11:STATE {to_bit(D11_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D12:STATE {to_bit(D12_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D13:STATE {to_bit(D13_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D14:STATE {to_bit(D14_display)}")
        scope.write(f"DISplay:WAVEView1:DCH1_D15:STATE {to_bit(D15_display)}")

    return String(s="Digital display")
