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
    """Reads raw samples from the specified task or virtual channels into the provided buffer.

    Raw samples constitute the internal representation of samples in a device, read directly from the device or buffer without scaling or reordering.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    connection : NIDAQmxDevice
        The device and channel for which a task has been initialized.
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

    task: nidaqmx.task.Task = connection.get_handle()

    logging.info(f"Reading {len(buffer)} bytes from {task.name}...")
    task.in_stream.readinto(buffer.v)

    return buffer
