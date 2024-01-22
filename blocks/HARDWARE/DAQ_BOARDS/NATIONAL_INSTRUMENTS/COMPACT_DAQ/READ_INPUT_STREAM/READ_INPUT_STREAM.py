from flojoy import flojoy, DataContainer, NIDAQmxConnection, Vector
import nidaqmx
from typing import Optional


@flojoy(deps={"nidaqmx": "0.9.0"}, inject_connection=True)
def READ_INPUT_STREAM(
    connection: NIDAQmxConnection,
    read_all: bool = False,
    number_of_samples_per_channel: int = 1000,
    default: Optional[DataContainer] = None,
) -> Vector:
    """Reads raw samples from the task or virtual channels you specified.

    Raw samples constitute the internal representation of samples in a device, read directly from the device or buffer without scaling or reordering.
    This block determines a Vector of appropriate size and data type to create and return based on your device specifications.

    This instrument will likely only be compatible with Windows systems due to
    NI driver availablity. To use the instrument you must install the runtime:

    https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html

    Parameters
    ----------
    connection : NIDAQmxDevice
        The first input channel for which a created task has been initialized.
    read_all : bool
        If True, reads all available samples in the buffer. If False, reads the number of samples you specify in number_of_samples_per_channel.
    number_of_samples_per_channel : int
        The number of samples, per channel, to read.

    Returns
    -------
    Vector
        Returns data in an interleaved or non-interleaved 1D array, depending on the raw ordering of the device. Refer to your device documentation for more information.
    """

    task: nidaqmx.task.Task = connection.get_handle()

    raw_data = (
        task.in_stream.readall()
        if read_all
        else task.in_stream.read(
            number_of_samples_per_channel=number_of_samples_per_channel
        )
    )
    return Vector(raw_data)
