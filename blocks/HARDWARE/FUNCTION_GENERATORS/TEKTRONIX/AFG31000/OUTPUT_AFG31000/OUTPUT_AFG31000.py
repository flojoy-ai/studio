from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def OUTPUT_AFG31000(
    connection: VisaConnection,
    ch1: Literal["on", "off"] = "on",
    ch2: Literal["on", "off"] = "on",
    ch1_impedance: Literal["50", "1e6"] = "50",
    ch2_impedance: Literal["50", "1e6"] = "50",
    input: Optional[DataContainer] = None,
) -> String:
    """Set impedances and turn the outputs on or off.

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_AFG31000 block).
    ch1: select, default=on
        Turn channel 1 output on or off.
    ch2: select, default=on
        Turn channel 2 output on or off.
    ch1_impedance: select, default=50
        Choosen channel 1 impedance.
    ch2_impedance: select, default=50
        Choosen channel 2 impedance

    Returns
    -------
    String
        Placeholder
    """

    afg = connection.get_handle()

    afg.write(f"OUTPut1:IMPedance {int(ch1_impedance)}")
    afg.write(f"OUTPut2:IMPedance {int(ch2_impedance)}")
    afg.write(f"OUTPUT1:STATE {ch1}")
    afg.write(f"OUTPUT2:STATE {ch2}")

    return String(s="Set output parameters")
