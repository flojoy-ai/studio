from flojoy import flojoy, DataContainer, Vector, DeviceConnectionManager
from typing import Optional


@flojoy(deps={"nidaqmx": "0.9.0"})
def READ_INPUT_STREAM(
    task_name: str,
    read_all: bool = False,
    number_of_samples_per_channel: int = 1000,
    default: Optional[DataContainer] = None,
) -> Vector:
    """Reads raw samples from the specified task or virtual channels.

    Raw samples constitute the internal representation of samples in a device, read directly from the device or buffer without scaling or reordering.
    This block determines a Vector of appropriate size and data type based on your device specifications.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    task_name : str
        The name of the task to read from.
    read_all : bool, optional
        If True, reads all available samples in the buffer. If False, reads the number of samples specified in `number_of_samples_per_channel` (default is False).
    number_of_samples_per_channel : int, optional
        The number of samples per channel to read (default is 1000).

    Returns
    -------
    Vector
        Returns data in an interleaved or non-interleaved 1D array, depending on the raw ordering of the device. Refer to your device documentation for more information.
    """

    task = DeviceConnectionManager.get_connection(task_name).get_handle()
    raw_data = (
        task.in_stream.readall()
        if read_all
        else task.in_stream.read(
            number_of_samples_per_channel=number_of_samples_per_channel
        )
    )
    return Vector(raw_data)
