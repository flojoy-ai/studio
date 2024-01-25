from flojoy import flojoy, DataContainer, NIDAQmxConnection
import nidaqmx
from typing import Optional, Literal


@flojoy(deps={"nidaqmx": "0.9.0"}, inject_connection=True)
def CONFIG_INPUT_STREAM(
    connection: NIDAQmxConnection,
    timeout: float = 10.0,
    offset: int = 0,
    relative_to: Literal[
        "Current Read Position",
        "First Pretrigger Sample",
        "First Sample",
        "Reference Trigger",
        "Most Recent Sample",
    ] = "Current Read Position",
    overwrite: bool = False,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Configure the properties of an input stream.

    This block is used to set the properties of an input stream for a given task before reading samples from the stream.

    **Compatibility:**
    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    connection : NIDAQmxDevice
        The first input channel for which a created task has been initialized.
    timeout : float, optional
        The amount of time, in seconds, to wait for the function to read the samples (default is 10.0 seconds).
    offset : int, optional
        Specifies an offset in samples per channel at which to begin a read operation. This offset is relative to the location you specify with `relative_to` (default is 0).
    relative_to : Literal
        Specifies the point in the buffer at which to begin a read operation. Valid options are:
        - "First Pretrigger Sample"
        - "First Sample"
        - "Reference Trigger"
        - "Most Recent Sample"
        - "Current Read Position" (default)
    overwrite : bool, optional
        Specifies whether to overwrite samples in the buffer that you have not yet read. If True, overwrite unread samples; if False, do not overwrite unread samples (default is False).

    Returns
    -------
    Optional[DataContainer]
        This block does not return any meaningful data; it is designed for configuring the input stream properties.
    """

    task: nidaqmx.task.Task = connection.get_handle()

    task.in_stream.timeout = timeout

    task.in_stream.offset = offset

    relative_to = {
        "First Pretrigger Sample": nidaqmx.constants.ReadRelativeTo.FIRST_PRETRIGGER_SAMPLE,
        "First Sample": nidaqmx.constants.ReadRelativeTo.FIRST_SAMPLE,
        "Reference Trigger": nidaqmx.constants.ReadRelativeTo.REFERENCE_TRIGGER,
        "Most Recent Sample": nidaqmx.constants.ReadRelativeTo.MOST_RECENT_SAMPLE,
        "Current Read Position": nidaqmx.constants.ReadRelativeTo.CURRENT_READ_POSITION,
    }[relative_to]
    task.in_stream.relative_to = relative_to

    overwrite = (
        nidaqmx.constants.OverwriteMode.OVERWRITE_UNREAD_SAMPLES
        if overwrite
        else nidaqmx.constants.OverwriteMode.DO_NOT_OVERWRITE_UNREAD_SAMPLES
    )
    task.in_stream.overwrite = overwrite

    return None
