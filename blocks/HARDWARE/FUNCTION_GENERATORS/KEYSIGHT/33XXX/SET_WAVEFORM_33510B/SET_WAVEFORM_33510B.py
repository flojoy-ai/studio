from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def SET_WAVEFORM_33510B(
    connection: VisaConnection,
    on_off: Literal["ON", "OFF"] = "OFF",
    query_set: Literal["query", "set"] = "query",
    channel: Literal["ch1", "ch2"] = "ch1",
    waveform: Literal[
        "SIN", "SQU", "TRI", "RAMP", "PULS", "PRBS", "NOIS", "ARB", "DC"
    ] = "SIN",
    frequency: float = 1e6,
    amplitude: float = 0.1,
    amplitude_unit: Literal["VPP", "VRMS", "DBM"] = "VPP",
    phase: float = 0,
    offset: float = 0,
    ramp_symmetry: float = 50,
    pulse_width: float = 20,
    default: Optional[DataContainer] = None,
) -> String:
    """Set waveform settings for a 33510B function generator.

    The Keysight 33510B has a variety of waveform settings available.

    Requires a CONNECTION_33510B node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible Keysight 33XXX wavefunction
    generators (although they are untested).

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX node).
    on_off: str
        Whether to turn the waveform generation to on or off.
    query_set: str
        Whether to query or set the waveform.
    channel: str
        The channel to set or query.
    waveform: str
        The type of waveform to use.
    frequency: float
        The voltage of the waveform to set, in Hz.
    amplitude: float
        The voltage of the waveform to set.
    amplitude_unit: str
        The voltage unit to set the waveform to.
    phase: float
        The phase to set the waveform to, in degrees.
    offset: float
        The voltage offset to set the waveform to, in volts.
    ramp_symmetry: float
        The ramp symmetry if the RAMP waveform is used, in percent.
    pulse_width: float
        The pulse width in nanoseconds if the PULS waveform is used.

    Returns
    -------
    DataContainer
        String: Summary of waveform generator settings.
    """

    ks = connection.get_handle()

    channel_str = channel
    channel = getattr(ks, channel)

    if on_off == "OFF":
        channel.output("OFF")

    match query_set:
        case "set":
            assert (
                -360.0 <= phase <= 360.0
            ), "The phase must be between -360 and 360 degrees."
            assert (
                0.0 <= ramp_symmetry <= 100.0
            ), "The ramp_symmetry must be between -0 and 100."
            assert (
                pulse_width >= 16
            ), "The pulse_width must be greater than or equal to 16 ns"

            channel.function_type(waveform)
            channel.amplitude_unit(amplitude_unit)
            channel.amplitude(amplitude)
            channel.phase(phase)
            channel.offset(offset)
            channel.frequency(frequency)
            if waveform == "RAMP":
                channel.ramp_symmetry(ramp_symmetry)
            if waveform == "PULS":
                channel.pulse_width(pulse_width)

            summary = f"{channel_str}: {waveform}, amplitude: {amplitude} "
            summary += f"{amplitude_unit}, frequency: {frequency} Hz"

        case "query":
            summary = f"{channel_str}: "
            waveform = channel.function_type()
            summary += f"waveform: {waveform}, \n"
            amplitude_unit = channel.amplitude_unit()
            amplitude = channel.amplitude()
            summary += f"amplitude: {amplitude} {amplitude_unit}, \n"
            frequency = channel.frequency()
            summary += f"frequency: {frequency} Hz, \n"
            phase = channel.phase()
            summary += f"phase: {phase}, \n"
            offset = channel.offset()
            summary += f"offset: {offset} V, \n"
            if waveform == "RAMP":
                channel.ramp_symmetry(ramp_symmetry)
                summary += f"ramp_symmetry: {ramp_symmetry}%, \n"
            if waveform == "PULS":
                channel.pulse_width(pulse_width)
                summary += f"pulse_width: {pulse_width}, \n"

    if on_off == "ON":
        channel.output("ON")

    return String(s=summary)
