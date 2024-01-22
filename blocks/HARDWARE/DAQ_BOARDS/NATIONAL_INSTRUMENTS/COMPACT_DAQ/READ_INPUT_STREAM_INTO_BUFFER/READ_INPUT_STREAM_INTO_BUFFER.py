from flojoy import flojoy, DataContainer, NIDAQmxConnection, Vector
import nidaqmx
from typing import Optional
import logging


@flojoy(deps={"nidaqmx": "0.9.0"}, inject_connection=True)
def READ_INPUT_STREAM_INTO_BUFFER(
    buffer: Vector,
    connection: NIDAQmxConnection,
    default: Optional[DataContainer] = None,
) -> Vector:
    """Reads raw samples from the task or virtual channels you specified in the buffer.

    Raw samples constitute the internal representation of samples in a device, read directly from the device or buffer without scaling or reordering.

    This instrument will likely only be compatible with Windows systems due to
    NI driver availablity. To use the instrument you must install the runtime:

    https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html

    Parameters
    ----------
    connection : NIDAQmxDevice
        The first input channel for which a created task has been initialized.
    buffer: Optional[Vector]
        Reads raw samples from the task or virtual channels you specify into this pre-allocated buffer.
        → number_of_samples_per_channel = math.floor(buffer_size_in_bytes / (number_of_channels_to_read * raw_sample_size_in_bytes)).

    Returns
    -------
    Vector
        Returns data in an interleaved or non-interleaved 1D array, depending on the raw ordering of the device. Refer to your device documentation for more information.
    """

    task: nidaqmx.task.Task = connection.get_handle()

    logging.info(f"Reading {len(buffer)} bytes from {task.name}...")
    task.in_stream.readinto(buffer.v)

    return buffer
