from flojoy import flojoy, DataContainer, DeviceConnectionManager, Vector
from typing import Optional


@flojoy(deps={"nidaqmx": "0.9.0"})
def READ_INPUT_STREAM_INTO_BUFFER(
    task_name: str,
    buffer: Vector,
    default: Optional[DataContainer] = None,
) -> Vector:
    """Reads raw samples from the specified task or virtual channels into the provided buffer.

    Raw samples constitute the internal representation of samples in a device, read directly from the device or buffer without scaling or reordering.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    task_name : str
        The name of the task to read from.
    buffer : Vector
        Reads raw samples from the specified task or virtual channels into this pre-allocated buffer.
        Ensure that the buffer size is appropriate for the expected number of samples and the raw sample size.
    default : Optional[DataContainer], optional
        Special parameter used by Flojoy to connect blocks together.

    Returns
    -------
    Vector
        Returns data in an interleaved or non-interleaved 1D array, depending on the raw ordering of the device. Refer to your device documentation for more information.
    """

    task = DeviceConnectionManager.get_connection(task_name).get_handle()

    task.in_stream.readinto(buffer.v)

    return buffer
