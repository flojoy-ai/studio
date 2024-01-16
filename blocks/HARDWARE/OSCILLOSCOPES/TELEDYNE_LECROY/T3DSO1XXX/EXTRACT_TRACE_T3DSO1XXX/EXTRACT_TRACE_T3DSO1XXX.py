from flojoy import flojoy, DataContainer, VisaConnection, OrderedPair
from typing import Optional, Literal
import logging


@flojoy(inject_connection=True)
def EXTRACT_TRACE_T3DSO1XXX(
    connection: VisaConnection,
    trace: Literal["C1", "C2", "C3", "C4"] = "C1",
    resolution: int | None = 5000,
    default: Optional[DataContainer] = None,
) -> OrderedPair:
    """Extracts the trace from an from an T3DSO1000(A)-2000 oscilloscope.

    The trace is defined by the x and y limits as seen on the instrument.

    Requires a CONNECT_T3DSO1XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should work with any Teledyne LeCroy T3DSO1000(A)-2000 series oscilloscope.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECT_T3DSO1XXX block).
    trace: Literal
        The trace to read the waveform from.
    resolution: int | None
        The number of points to read from the trace. If None, the full trace is return.
    default: DataContainer
        The input data container.

    Returns
    -------
    OrderedPair
        The trace of the oscilloscope.
    """

    scope = connection.get_handle()

    scope.write("chdr off")

    voltage_scale = scope.query(f"{trace}:vdiv?")
    offset = scope.query(f"{trace}:ofst?")
    time_scale = scope.query("tdiv?")
    sample_rate = scope.query("sara?")

    sample_rate_unit = {"G": 1e9, "M": 1e6, "k": 1e3}
    for unit in sample_rate_unit.keys():
        if sample_rate.find(unit) != -1:
            sample_rate = sample_rate.split(unit)
            sample_rate = float(sample_rate[0]) * sample_rate_unit[unit]
            break
    sample_rate = float(sample_rate)
    scope.chunk_size = 20 * 1024 * 1024
    scope.write(f"{trace}:wf? dat2")  # Get waveform data - Depends on the WFSO setting
    recv = list(scope.read_raw())[15:]
    recv.pop()
    recv.pop()
    volt_value = []
    for i, data in enumerate(recv):
        if data > 127:
            data = data - 255
        volt_value.append(data)
    time_value = []
    for idx in range(0, len(volt_value)):
        volt_value[idx] = volt_value[idx] / 25 * float(voltage_scale) - float(offset)
        time_data = -(float(time_scale) * 14 / 2) + idx * (1 / sample_rate)
        time_value.append(time_data)

    # Downsample base on user input
    if isinstance(resolution, int):
        assert resolution > 0, "Resolution must be greater than zero"
        if resolution > len(time_value):
            logging.warning(
                f"Resolution ({resolution}) is greater than the number of points ({len(time_value)}). Returning full trace."
            )
        else:
            step = int(len(time_value) // resolution)
            time_value = time_value[::step]
            volt_value = volt_value[::step]

    return OrderedPair(x=time_value, y=volt_value)
