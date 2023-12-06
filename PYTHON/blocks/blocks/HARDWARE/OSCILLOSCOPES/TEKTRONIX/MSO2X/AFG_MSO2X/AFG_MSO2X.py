from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def AFG_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    function: Literal[
        "sine",
        "square",
        "pulse",
        "ramp",
        "noise",
        "DC",
        "sinc",
        "gaussian",
        "lorentz ",
        "erise",
        "edecay",
        "haversine",
        "cardiac",
    ] = "sine",
    frequency: float = 100e6,
    amplitude: float = 0.2,
    offset: float = 0,
    ramp_symmetry: float = 50,
    square_duty: float = 50,
    pulse_width: float = 1e-6,
    impedance: Literal["unchanged", "fifty", "highZ"] = "unchanged",
    mode: Literal["off", "continuous", "burst"] = "continuous",
) -> String:
    """Set the MSO2XX Function Generator settings.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    function : select, default=sine
        The type of waveform to use.
    frequency : float, default=100e6
        The frequency of the waveform, in Hz.
    amplitude : float, default=0.2
        The peak to peak voltage of the waveform, in volts.
    offset : float, default=0
        The voltage offset of the waveform, in volts.
    ramp_symmetry : float, default=50
        The ramp symmetry if the ramp waveform is used, in percent.
    square_duty : float, default=50
        The duty of the square waveform if used, in percent.
    pulse_width : float, default=1e-6
        The pulse width in seconds if the pulse waveform is used.
    impedance : select, default=unchanged
        The impedance of the output.
    mode : select, default=continuous
        The mode to use.

    Returns
    -------
    String
        AFG settings
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    scope.commands.afg.function.write(function)
    scope.commands.afg.frequency.write(frequency)
    scope.commands.afg.amplitude.write(amplitude)
    scope.commands.afg.offset.write(offset)

    if function == "ramp":
        scope.commands.afg.ramp.symmetry.write(ramp_symmetry)
    if function == "square":
        scope.commands.afg.square.duty.write(square_duty)
    if function == "pulse":
        scope.commands.afg.pulse.width.write(pulse_width)
    if impedance != "unchanged":
        scope.commands.afg.output.load.impedance.write(impedance)

    scope.commands.afg.output.mode.write(mode)

    return String(s="AFG settings")
