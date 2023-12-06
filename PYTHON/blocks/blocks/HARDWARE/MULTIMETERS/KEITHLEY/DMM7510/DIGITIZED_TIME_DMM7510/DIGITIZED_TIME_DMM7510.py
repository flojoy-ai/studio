from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, OrderedPair


@flojoy(inject_connection=True)
def DIGITIZED_TIME_DMM7510(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    function: Literal[
        "Digitize voltage",
        "Digitize current",
    ] = "Digitize voltage",
    num_samples: int = 100,
    sample_rate: float = 1e3,
    range: float = 1,
) -> OrderedPair:
    """Measures digitized data vs time.

    Requires a CONNECT_DMM7510 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_DMM7510 block).
    function : select, default=Digitize voltage
        Select the measurement function
    num_samples : int, default=100
        The number of points/samples to measure.
    sample_rate : float, default=1000
        The number of samples per second.
    range : float, default=1
        The range of the function measurement.

    Returns
    -------
    OrderedPair
        x: time
        y: measurements
    """

    dmm = connection.get_handle()

    if function == "Digitize voltage":
        dmm.write("dmm.digitize.func = dmm.FUNC_DIGITIZE_VOLTAGE")
    else:
        dmm.write("dmm.digitize.func = dmm.FUNC_DIGITIZE_CURRENT")

    dmm.write(f"dmm.digitize.range = {range}")
    dmm.write(f"dmm.digitize.samplerate = {sample_rate}")
    dmm.write(f"dmm.digitize.count = {num_samples}")

    dmm.write("dmm.digitize.aperture = dmm.APERTURE_AUTO")
    dmm.commands.dmm.digitize.inputimpedance = "dmm.IMPEDANCE_AUTO"

    dmm.commands.buffer_var["defbuffer1"].capacity = num_samples
    dmm.write("defbuffer1.clear()")
    dmm.write("dmm.digitize.read()")

    time = []
    y = []
    for cnt in range(1, num_samples + 1):
        y.append(float(dmm.commands.buffer_var["defbuffer1"].readings[cnt]))
        time.append(
            float(dmm.commands.buffer_var["defbuffer1"].relativetimestamps[cnt])
        )

    return OrderedPair(x=time, y=y)
