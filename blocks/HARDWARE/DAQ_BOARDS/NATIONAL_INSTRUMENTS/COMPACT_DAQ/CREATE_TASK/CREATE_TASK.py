from flojoy import flojoy, DataContainer, DeviceConnectionManager, HardwareDevice
from typing import Optional
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"})
def CREATE_TASK(
    task_name: str,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Creates a task

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    task_name : str
        The name of the task to create.

    Returns
    -------
    Optional[DataContainer]
        This block does not return any meaningful data;
    """

    assert (
        task_name not in DeviceConnectionManager.handles
    ), f"Task {task_name} already exists"
    assert task_name != "" and task_name is not None, "Task name cannot be empty"

    task = nidaqmx.Task(new_task_name=task_name)
    DeviceConnectionManager.register_connection(
        HardwareDevice(task_name), task, lambda task: task.close()
    )
