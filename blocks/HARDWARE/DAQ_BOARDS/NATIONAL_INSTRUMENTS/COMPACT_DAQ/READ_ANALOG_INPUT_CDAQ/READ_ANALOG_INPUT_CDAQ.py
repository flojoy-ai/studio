from flojoy import flojoy, DataContainer, String, Vector, DeviceConnectionManager
from typing import Optional
import nidaqmx
import logging
from typing import Literal

@flojoy(deps={"nidaqmx": "0.9.0"})
def READ_ANALOG_INPUT_CDAQ(
    channel: String,
    number_of_sample: int = 1,
    channel_type: Literal[
        "Current",
        "Thermocouple",
        "Voltage",
    ] = "Current",
    default = Optional[DataContainer]
) -> Vector:
    """Todo

    Todo

    Parameters
    ----------
    device: VisaDevice
        The VISA address to connect to.

    Returns
    -------
    DataContainer
        None.
    """

    # sample_count: int = 1
    # rate: (int, float) = 1000.0
    # mode: Literal[
    #     "differential",
    #     "pseudo-differential",
    #     "single-ended referenced",
    #     "single-ended non-referenced",
    # ] = "differential"

    # mode_lookup = {
    #     "differential": nidaqmx.DAQ PyDAQmx.DAQmx_Val_Diff,
    #     "pseudo-differential": PyDAQmx.DAQmx_Val_PseudoDiff,
    #     "single-ended referenced": PyDAQmx.DAQmx_Val_RSE,
    #     "single-ended non-referenced": PyDAQmx.DAQmx_Val_NRSE,
    # }
    #

    # To check if everything is properly setup
    channel: nidaqmx.system.physical_channel.PhysicalChannel = DeviceConnectionManager.get_connection(channel.s)._handle

    logging.info(f"channel.name: {channel.name}")
    sample = []
    with nidaqmx.Task() as task:
        match channel_type:
            case "Current":
                task.ai_channels.add_ai_current_chan(channel.name)
            case "Thermocouple":
                task.ai_channels.add_ai_thrmcpl_chan(channel.name)
            case "Voltage":
                task.ai_channels.add_ai_voltage_chan(channel.name)
            case _:
                raise NotImplementedError("This feature is still under development")

        sample = task.read(number_of_samples_per_channel=number_of_sample)
    logging.info(f"Data: {sample}")
    return Vector(sample)
