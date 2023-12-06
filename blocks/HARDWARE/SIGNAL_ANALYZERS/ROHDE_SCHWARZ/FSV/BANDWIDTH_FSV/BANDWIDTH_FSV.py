from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional


@flojoy(inject_connection=True)
def BANDWIDTH_FSV(
    connection: VisaConnection,
    resolution_bandwidth: float = 0,
    video_bandwidth: float = 0,
    default: Optional[DataContainer] = None,
) -> String:
    """The BANDWIDTH_FSV block sets the bandwidths for the signal analyzer.

    If the bandwidths are set to 0, the bandwidths will be automatic.

    Requires a CONNECTION_FSV node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible R&S network analyzers.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_FSV node).
    resolution_bandwidth: float
        Resolution bandwidth, in Hz. Set to automatic if equal to 0.
    video_bandwidth: float
        Video bandwidth, in Hz. Set to automatic if equal to 0.

    Returns
    -------
    String
        Sweep settings summary.
    """

    rohde = connection.get_handle()

    s = "Bandwidth settings: "

    if resolution_bandwidth == 0:
        rohde.write("BAND:AUTO ON")
        s += "resolution bandwidth: automatic"
    else:
        rohde.write(f"BAND {resolution_bandwidth}")
        s += f"resolution bandwidth: {resolution_bandwidth}"

    if video_bandwidth == 0:
        rohde.write("BAND:VID:AUTO ON")
        s += "video bandwidth: automatic"
    else:
        rohde.write(f"BAND:VID {video_bandwidth}")
        s += f"video bandwidth: {resolution_bandwidth}"

    return String(s=s)
