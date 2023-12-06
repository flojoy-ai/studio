from flojoy import flojoy, OrderedPair, String, VisaConnection, Vector
from typing import Literal
from numpy import max, min


@flojoy(inject_connection=True)
def ARBITRARY_AFG31000(
    input: OrderedPair | Vector,
    connection: VisaConnection,
    memory_state: Literal["EMEM1", "EMEM2"] = "EMEM1",
    source: Literal["1", "2"] = "1",
    frequency: float = 1e6,
    amplitude: float = 1,
    offset: float = 0,
    phase: float = 0,
) -> String:
    """Take the input waveform and use it as the arbitrary wavefunction.

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_AFG31000 block).
    memory_state: select, default=EMEM1
        Save the function in "Edit Memory" 1 or 2.
    channel: select, default=1
        Choose the channel to use with the waveform.
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
        Set FG parameters
    """

    assert -180.0 <= phase <= 180.0, "The phase must be between -180 and 180 degrees."

    afg = connection.get_handle()

    match input:
        case OrderedPair():
            y = input.y
        case Vector():
            y = input.v

    y -= min(y)
    y /= max(y)
    y *= 16383

    afg.write_binary_values(
        f"DATA:DATA {memory_state}, ", y, is_big_endian=True, datatype="h"
    )
    afg.write(f"SOURCE{source}:FUNCTION {memory_state}")

    afg.write(f"SOURCE{source}:FREQUENCY {frequency}")
    afg.write(f"SOURCE{source}:VOLTAGE:AMPLITUDE {amplitude}")
    afg.write(f"SOURCE{source}:VOLTAGE:OFFSET {offset}")
    afg.write(f"SOURCE{source}:PHASE:ADJUST {phase}DEG")

    return String(s="Set FG parameters")
