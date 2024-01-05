from flojoy import flojoy, Scalar, VisaConnection
from typing import Literal


@flojoy(inject_connection=True)
def INPUT_PARAM_AFG31000(
    connection: VisaConnection,
    source: Literal["1", "2"] = "1",
    parameter: Literal[
        "frequency",
        "amplitude",
        "offset",
        "phase",
        "pulse_width",
        "ramp_symmetry",
    ] = "frequency",
    input: Scalar = 90,
) -> Scalar:
    """Set the parameters using the input Scalar.

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_AFG31000 block).
    source: select, default=1
        Choose the channel to alter.
    parameter: select, default=frequency
        Choose the parameter to alter.
    input : Scalar
        The value to change the selected parameter to.

    Returns
    -------
    Scalar
        The input value
    """

    afg = connection.get_handle()

    if parameter == "frequency":
        afg.write(f"SOURCE{source}:FREQUENCY {input.c}")
    elif parameter == "amplitude":
        afg.write(f"SOURCE{source}:VOLTAGE:AMPLITUDE {input.c}")
    elif parameter == "offset":
        afg.write(f"SOURCE{source}:VOLTAGE:OFFSET {input.c}")
    elif parameter == "phase":
        assert (
            -180.0 <= input.c <= 180.0
        ), "The phase must be between -180 and 180 degrees."
        afg.write(f"SOURCE{source}:PHASE:ADJUST {input.c}DEG")
    elif parameter == "pulse_wdith":
        afg.write(f"SOURCE{source}:PULSE:WIDTH {input.c}")
    elif parameter == "ramp_symmetry":
        assert 0 <= input.c <= 100.0, "The phase must be between 0 and 100%."
        afg.write(f"SOURCE{source}:FUNCtion:RAMP:SYMMETRY {input.c}")

    return Scalar(c=input.c)
