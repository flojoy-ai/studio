from flojoy import flojoy, DataContainer, NIDAQmxConnection
from typing import Optional
import nidaqmx


@flojoy(deps={"nidaqmx": "0.9.0"}, inject_connection=True)
def CONFIG_TASK_SAMPLE_CLOCK_TIMING(
    connection: NIDAQmxConnection,
    sample_clock_rate: float = 1000.0,
    number_of_samples_per_channel: int = 1000,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """.

    Compatible with National Instruments compactDAQ devices.
    Tested on a simulated NI-9229 module.

    Parameters
    ----------
    cDAQ_start_channel : NIDAQmxDevice
        The device and channel to read from.
    sample_clock_rate : float
        Specifies the sampling rate in samples per channel per second.
        If you use an external source for the Sample Clock, set this input to the maximum expected rate of that clock.
        Uses the onboard clock of the device.
    number_of_samples_per_channel : int
        Specifies the number of samples to acquire or generate for each channel in the task

    Returns
    -------
    Optional[DataContainer]
        None
    """

    task: nidaqmx.task.Task = connection.get_handle()
    task.timing.cfg_samp_clk_timing(
        rate=sample_clock_rate, samps_per_chan=number_of_samples_per_channel
    )
