from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def FUNCTION_AFG31000(
    connection: VisaConnection,
    source: Literal["1", "2"] = "1",
    functions: Literal[
        "sinusoid",
        "square",
        "pulse",
        "ramp",
        "prnoise",
        "DC",
        "sinc",
        "gaussian",
        "lorentz",
        "erise",
        "edecay",
        "haversine",
    ] = "sinusoid",
    frequency: float = 1e6,
    amplitude: float = 1,
    offset: float = 0,
    phase: float = 0,
    pulse_width: float = 1e-6,
    ramp_symmetry: float = 50,
    input: Optional[DataContainer] = None,
) -> String:
    """Set the parameters for the built-in function generator.

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_AFG31000 block).
    channel: select, default=1
        Choose the channel to alter.
    functions: select, default=sinusoid
        Choose the function to output
    frequency: float, default=1e6
        The voltage of the waveform to set, in Hz.
    amplitude: float, default=1
        The voltage of the waveform to set.
    offset: float, default=0
        The voltage offset to set the waveform to, in volts.
    phase: float, default=0
        The phase to set the waveform to, in degrees.
    pulse_width: float, default=1e-6
        The pulse width in nanoseconds if the PULS waveform is used.
    ramp_symmetry: float, default=50
        The ramp symmetry if the RAMP waveform is used, in percent.

    Returns
    -------
    String
        Placeholder
    """

    assert -180.0 <= phase <= 180.0, "The phase must be between -180 and 180 degrees."

    afg = connection.get_handle()

    afg.write(f"SOURCE{source}:FUNCtion:SHAPe {functions}")
    afg.write(f"SOURCE{source}:FREQUENCY {frequency}")
    afg.write(f"SOURCE{source}:VOLTAGE:AMPLITUDE {amplitude}")
    afg.write(f"SOURCE{source}:VOLTAGE:OFFSET {offset}")
    afg.write(f"SOURCE{source}:PHASE:ADJUST {phase}DEG")

    if functions == "pulse":
        afg.write(f"SOURCE{source}:PULSE:WIDTH {pulse_width}")
    if functions == "ramp":
        assert 0 <= ramp_symmetry <= 100.0, "The phase must be between 0 and 100%."
        afg.write(f"SOURCE{source}:FUNCtion:RAMP:SYMMETRY {ramp_symmetry}")

    return String(s="Set FG parameters")
