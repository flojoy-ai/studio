from flojoy import flojoy, DataContainer, Vector, Matrix, DeviceConnectionManager
import nidaqmx
from typing import Optional
import numpy as np


@flojoy(deps={"nidaqmx": "0.9.0"})
def READ_TASK(
    task_name: str,
    number_of_samples_per_channel: int = 1,
    timeout: float = 10.0,
    wait_infinitely: bool = False,
    default: Optional[DataContainer] = None,
) -> Vector | Matrix:
    """Reads one or more current samples from a National Instruments compactDAQ device.

    Read one or more current samples from a National Instruments compactDAQ device. The connection must have been initialized with a create task before calling this block.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    task_name : str
        The name of the task to read from.
    number_of_samples_per_channel : int, optional
        Number of samples to read (default is 1).
    timeout : float, optional
        Time to wait for samples to become available. If set to 0, the method tries once to read the requested samples and returns an error if it is unable to (default is 10.0 seconds).
    wait_infinitely : bool, optional
        If True, the method waits indefinitely for samples to become available. If False, the method waits for the amount of time specified by `timeout` (default is False).

    Returns
    -------
    Vector | Matrix
        Samples read from the device.
    """

    task = DeviceConnectionManager.get_connection(task_name).get_handle()

    assert (
        number_of_samples_per_channel > 0
    ), "number_of_samples_per_channel must be greater than 0"
    timeout = timeout if not wait_infinitely else nidaqmx.constants.WAIT_INFINITELY

    values = np.array(
        task.read(
            number_of_samples_per_channel=number_of_samples_per_channel, timeout=timeout
        )
    )
    return Matrix(values) if values.ndim > 1 else Vector(values)
