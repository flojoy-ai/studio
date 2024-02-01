from flojoy import flojoy, DataContainer, DeviceConnectionManager
from typing import Optional


@flojoy(deps={"nidaqmx": "0.9.0"})
def TASK_WAIT_UNTIL_DONE(
    task_name: str,
    timeout: float = 10.0,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Waits for the measurement or generation to complete.

    Use this method to ensure that the specified operation is complete before you stop the task.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    task_name: str
        The name of the task to wait for.
    timeout : float
        Specifies the maximum amount of time in seconds to wait for the measurement or generation to complete. This method returns an error if the time elapses.

    Returns
    -------
    Optional[DataContainer]
        Return the input
    """

    task = DeviceConnectionManager.get_connection(task_name).get_handle()
    task.wait_until_done(timeout=timeout)
    return default
