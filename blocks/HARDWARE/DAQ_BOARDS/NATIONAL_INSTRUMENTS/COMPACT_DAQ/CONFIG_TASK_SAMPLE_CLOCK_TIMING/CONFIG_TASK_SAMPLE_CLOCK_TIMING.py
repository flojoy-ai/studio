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
    """Configures the timing for the sample clock of a task.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx. Tested on a simulated NI-9229 module.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from [NI-DAQmx Download Page](https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html).

    Parameters
    ----------
    connection : NIDAQmxDevice
        The device and channel to read from. A NIDAQmx task must be created and initialized using `create_task_xxxx` before passing it to this block.
    sample_clock_rate : float, optional
        Specifies the sampling rate in samples per channel per second. If using an external source for the Sample Clock, set this input to the maximum expected rate of that clock. Uses the onboard clock of the device (default is 1000.0).
    number_of_samples_per_channel : int, optional
        Specifies the number of samples to acquire or generate for each channel in the task (default is 1000).

    Returns
    -------
    Optional[DataContainer]
        This block does not return any meaningful data; it is designed for configuring the task's sample clock timing.

    """

    task: nidaqmx.task.Task = connection.get_handle()
    task.timing.cfg_samp_clk_timing(
        rate=sample_clock_rate, samps_per_chan=number_of_samples_per_channel
    )
