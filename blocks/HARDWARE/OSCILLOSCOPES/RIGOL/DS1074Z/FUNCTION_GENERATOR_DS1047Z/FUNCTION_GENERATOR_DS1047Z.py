from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def FUNCTION_GENERATOR_DS1047Z(
    connection: VisaConnection,
    source: Literal[1, 2] = 1,
    source_on: bool = True,
    impedance: Literal["highZ", "50"] = "50",
    frequency: float = 1e5,
    phase: float = 0,
    align_phases: bool = True,
    function: Literal[
        "sin",
        "squ",
        "ramp",
        "pulse",
        "noise",
        "DC",
        "ext",
        "sinc",
        "exprise",
        "expfall",
        "ECG",
        "gauss",
        "lorentz",
        "haversine",
    ] = "sin",
    amplitude: float = 0.1,
    voltage_offset: float = 0,
    ramp_symmetry: float = 0,
    duty_cycle: float = 0,
    default: Optional[DataContainer] = None,
) -> String:
    """Controls the function generator, AKA 'Source' 1 and 2.

    Requires a CONNECTION_DS1074Z node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_DS1074Z node).
    source: int
        Control source 1 or 2.
    source_on: bool
        Turn the wavefunction generator on (True) or off (False.)
    impedance: str
        Use high (~1e6) or 50 Ohm impedance.
    frequency: float
        The output frequency, in Hz.
    phase: float = 0
        The output frequency, in degrees.
    align_phases: bool
        Align the phases of source 1 and 2 (use after both phases are set).
    function: str
        Choose the desired wavefunction shape.
    amplitude: float
        Peak-to-peak amplitude, in V.
    voltage_offset: float
        The vertical voltage offset, in V.
    ramp_symmetry: float = 0,
        The symmetry of the ramp wavefunction, if used. 0-100%.
    duty_cycle: float = 0,
        The duty cycle of the pulse wavefunction, if used. 0-100%.

    Returns
    -------
    DataContainer
        String: summary of channel settings.
    """

    rigol = connection.get_handle()

    s = f"Wavefunction settings:   Source: {source} "

    if source_on:
        rigol.write(f":OUTPut{source} ON")
        s += "ON , "
    else:
        rigol.write(f":OUTPut{source} OFF")
        s += "OFF , "

    s += f"Impedance: {impedance}, "
    if impedance == "50":
        rigol.write(f":OUTPut{source}:IMPedance FIFTy")
    else:
        rigol.write(f":OUTPut{source}:IMPedance OMEG")

    s += f"Function: {function}, "
    rigol.write(f":SOURce{source}:FUNC {function}")

    s += f"Frequency: {frequency} Hz, Phase: {phase} degrees, "
    s += f"Amplitude: {amplitude} V, Offset: {voltage_offset} V, "
    rigol.write(f":SOURce{source}:FREQ {frequency}")
    rigol.write(f":SOURce{source}:PHASe {phase}")
    rigol.write(f":SOURce{source}:VOLT {amplitude}")
    rigol.write(f":SOURce{source}:VOLTage:OFFSet {voltage_offset}")

    if function == "ramp":
        rigol.write(f":SOURce{source}:FUNCtion:RAMP:SYMMetry {ramp_symmetry}")
    elif function == "pulse":
        rigol.write(f":SOURce{source}:PULSe:DCYCle {duty_cycle}")

    if align_phases:
        rigol.write(":PHASe:INIT")

    return String(s=s)
