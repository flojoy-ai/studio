from flojoy import flojoy, DataContainer, NIDAQmxConnection, Vector
import nidaqmx
from typing import Optional
import logging


@flojoy(deps={"nidaqmx": "0.9.0"}, inject_connection=True)
def READ_INPUT_STREAM(
    connection: NIDAQmxConnection,
    read_all: bool = False,
    number_of_samples_per_channel: int = 1000,
    timeout: float = 10.0,
    default: Optional[DataContainer] = None,
    buffer: Optional[Vector] = None
) -> Vector:
    """Reads raw samples from the task or virtual channels you specify.

    Raw samples constitute the internal representation of samples in a device, read directly from the device or buffer without scaling or reordering.

    Parameters
    ----------
    cDAQ_start_channel : NIDAQmxDevice
        The first input channel for which a created task has been initialized.
    read_all : bool
        If True, reads all available samples in the buffer. If False, reads the number of samples you specify in number_of_samples_per_channel.
    number_of_samples_per_channel : int
        The number of samples, per channel, to read.
    buffer: Optional[Vector]
        If a buffer is provided, reads raw samples from the task or virtual channels you specify into this pre-allocated buffer.
            → Ignore other parameters if buffer is provided.
            → number_of_samples_per_channel = math.floor(buffer_size_in_bytes / (number_of_channels_to_read * raw_sample_size_in_bytes)).

    Returns
    -------
    Vector
        Return the input
    """

    task: nidaqmx.task.Task = connection.get_handle()

    logging.info(f"Buffer: {buffer}")
    if buffer is not None:
        task.in_stream.readinto(buffer.v)
        return buffer

    raw_data = task.in_stream.readall() if read_all else task.in_stream.read(number_of_samples_per_channel=number_of_samples_per_channel)
    return Vector(raw_data)
