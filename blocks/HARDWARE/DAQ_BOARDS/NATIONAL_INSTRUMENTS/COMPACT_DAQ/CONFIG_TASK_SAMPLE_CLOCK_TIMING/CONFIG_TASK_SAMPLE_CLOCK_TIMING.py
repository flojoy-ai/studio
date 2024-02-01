from flojoy import flojoy, DataContainer, DeviceConnectionManager
from typing import Optional


@flojoy(deps={"nidaqmx": "0.9.0"})
def CONFIG_TASK_SAMPLE_CLOCK_TIMING(
    task_name: str,
    sample_clock_rate: float = 1000.0,
    number_of_samples_per_channel: int = 1000,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Configures the timing for the sample clock of a task.

    **Compatibility:**
    Compatible with National Instruments devices that utilize NI-DAQmx. Tested on a simulated NI-9229 module.

    This block is designed for use with Windows and Linux systems due to NI driver availability. Ensure you have installed the NI-DAQmx runtime from https://www.ni.com/en/support/downloads/drivers/download.ni-daq-mx.html.

    Parameters
    ----------
    task_name : str
        The name of the task to configure.
    sample_clock_rate : float, optional
        Specifies the sampling rate in samples per channel per second. If using an external source for the Sample Clock, set this input to the maximum expected rate of that clock. Uses the onboard clock of the device (default is 1000.0).
    number_of_samples_per_channel : int, optional
        Specifies the number of samples to acquire or generate for each channel in the task (default is 1000).

    Returns
    -------
    Optional[DataContainer]
        This block does not return any meaningful data; it is designed for configuring the task's sample clock timing.

    """

    task = DeviceConnectionManager.get_connection(task_name).get_handle()
    task.timing.cfg_samp_clk_timing(
        rate=sample_clock_rate, samps_per_chan=number_of_samples_per_channel
    )
