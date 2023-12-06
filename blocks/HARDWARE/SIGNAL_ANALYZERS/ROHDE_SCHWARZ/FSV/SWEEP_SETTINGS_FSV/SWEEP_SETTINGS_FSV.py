from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def SWEEP_SETTINGS_FSV(
    connection: VisaConnection,
    span_or_range: Literal["span", "range"] = "range",
    center: float = 1e8,
    span: float = 1e7,
    start: float = 1e7,
    stop: float = 1e8,
    sweep_type: Literal["sweep", "FFT", "auto"] = "auto",
    sweep_time: float = 0,
    counts: int = 10,
    points: int = 1000,
    default: Optional[DataContainer] = None,
) -> String:
    """Set sweep settings for a FSV.
    Note that span/center and start/stop can be used equivalently if:
    start = center - (span / 2) and stop = center + (span / 2).

    Requires a CONNECTION_FSV block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible R&S network analyzers.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_FSV block).
    span_or_range: select
        X axis range, span (center and span) or range (start and stop).
    center: float
        The center of the x axis range, in Hz.
    span: float
        The span of the x axis, in Hz.
    start: float
        The start point of the x axis, in Hz.
    stop: float
        The end point of the x axis, in Hz.
    sweep_type: select
        How the FSV sweeps along the x axis range.
    sweep_type: float
        The sweep time (set to auto if = 0), in seconds.
    counts: int
        Number of sweeps to do, (average optional in INIT_SWEEP_FSV).
    points: int
        Number of x axis points to sweep.

    Returns
    -------
    String
        Sweep settings summary.
    """

    rohde = connection.get_handle()

    s = "Sweep settings: "

    if span_or_range == "span":
        rohde.write(f"FREQ:CENT {center}")
        rohde.write(f"FREQ:SPAN {span}")
        s += f"Center: {center} Hz; Span: {span} Hz: "
    elif span_or_range == "range":
        rohde.write(f"FREQ:STAR {start}")
        rohde.write(f"FREQ:STOP {stop}")
        s += f"Start: {start} Hz; Stop: {stop} Hz: "

    s += f"Sweep: {sweep_type}: "
    if sweep_type == "sweep":
        sweep_type = "SWE"
    rohde.write(f"SWE:TYPE {sweep_type.upper()}")

    if sweep_time == 0:
        rohde.write("SWE:TIME:AUTO ON")
    else:
        rohde.write(f"SWE:TIME {sweep_time}")

    rohde.write(f"SWE:COUN {counts}")
    rohde.write(f"SWE:POIN {points}")
    s += f"Counts: {counts}; Points: {points}"

    return String(s=s)
