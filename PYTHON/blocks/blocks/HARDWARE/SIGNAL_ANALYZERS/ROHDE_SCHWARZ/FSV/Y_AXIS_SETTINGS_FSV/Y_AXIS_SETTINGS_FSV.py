from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def Y_AXIS_SETTINGS_FSV(
    connection: VisaConnection,
    ref_level: float = -30,
    spacing_type: Literal["logarithmic", "linear %", "linear dB"] = "logarithmic",
    spacing: float = 40,
    default: Optional[DataContainer] = None,
) -> String:
    """The Y_AXIS_SETTINGS_FSV node sets the y axis range.

    Note that these settings will not affect the trace returned by
    EXTRACT_SWEEP_FSV. It will change the view on the instrument itself.

    Requires a CONNECTION_FSV node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible R&S network analyzers.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_FSV node).
    ref_level: float
        The reference level (top of the y axis), in dBm.
    spacing_type: select
        The type of spacing for the y axis (bottom = ref - spacing).
    spacing: float
        Spacing for the y axis (bottom = ref - spacing), in dB or %.

    Returns
    -------
    String
        Y axis settings summary.
    """

    rohde = connection.get_handle()

    s = f"Y axis settings: Reference level: {ref_level}, "
    s += f"Spacing type: {spacing_type}"

    rohde.write(f"DISP:TRAC:Y:RLEV {ref_level}")

    match spacing_type:
        case "logarithmic":
            rohde.write("DISP:TRAC:Y:SPAC LOG")
        case "linear %":
            rohde.write("DISP:TRAC:Y:SPAC LIN")
        case "linear dB":
            rohde.write("DISP:TRAC:Y:SPAC LDB")

    rohde.write(f"DISP:TRAC:Y {spacing}")

    return String(s=s)
