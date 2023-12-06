from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def BASIC_PARAMETERS_AFG31000(
    connection: VisaConnection,
    source: Literal["1", "2"] = "1",
    frequency: float = 1e6,
    amplitude: float = 1,
    offset: float = 0,
    phase: float = 0,
    input: Optional[DataContainer] = None,
) -> String:
    """Set basic parameters such as frequency for a single channel.

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_AFG31000 block).
    channel: select, default=1
        Choose the channel to alter.
    frequency: float, default=1e6
        The voltage of the waveform to set, in Hz.
    amplitude: float, default=1
        The voltage of the waveform to set.
    offset: float, default=0
        The voltage offset to set the waveform to, in volts.
    phase: float, default=0
        The phase to set the waveform to, in degrees.

    Returns
    -------
    String
        Placeholder
    """

    assert -180.0 <= phase <= 180.0, "The phase must be between -180 and 180 degrees."

    afg = connection.get_handle()

    afg.write(f"SOURCE{source}:FREQUENCY {frequency}")
    afg.write(f"SOURCE{source}:VOLTAGE:AMPLITUDE {amplitude}")
    afg.write(f"SOURCE{source}:VOLTAGE:OFFSET {offset}")
    afg.write(f"SOURCE{source}:PHASE:ADJUST {phase}DEG")

    return String(s="Set FG parameters")
