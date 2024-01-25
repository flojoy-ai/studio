from flojoy import flojoy, DataContainer, Vector, Matrix, NIDAQmxConnection
import nidaqmx
from typing import Optional
import numpy as np


@flojoy(deps={"nidaqmx": "0.9.0"}, inject_connection=True)
def READ_TASK(
    connection: NIDAQmxConnection,
    number_of_samples_per_channel: int = 1,
    timeout: float = 10.0,
    wait_infinitely: bool = False,
    default: Optional[DataContainer] = None,
) -> Vector | Matrix:
    """Reads one or more current samples from a National Instruments compactDAQ device.

    Read one or more current samples from a National Instruments compactDAQ device. The connection must have been initialized with a create task before calling this block.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from [NI-DAQmx Download Page](https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html).

    Parameters
    ----------
    connection : NIDAQmxDevice
        The device and channel for which a task has been initialized.
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

    task: nidaqmx.task.Task = connection.get_handle()

    assert (
        number_of_samples_per_channel > 0
    ), "number_of_samples_per_channel must be greater than 0"
    timeout = timeout if not wait_infinitely else nidaqmx.constants.WAIT_INFINITELY

    # TODO Add REAL_ALL_AVAIALBLE | nb_sample = number_of_samples_per_channel if not real_all_available_samples else nidaqmx.constants.READ_ALL_AVAILABLE

    values = np.array(
        task.read(
            number_of_samples_per_channel=number_of_samples_per_channel, timeout=timeout
        )
    )
    return Matrix(values) if values.ndim > 1 else Vector(values)
