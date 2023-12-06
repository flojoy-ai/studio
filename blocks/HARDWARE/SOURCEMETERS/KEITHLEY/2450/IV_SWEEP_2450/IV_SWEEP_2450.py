from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, OrderedPair
from time import sleep


@flojoy(deps={"tm_devices": "1.0"}, inject_connection=True)
def IV_SWEEP_2450(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    sweep: Literal["voltage", "current"] = "voltage",
    sense: Literal["2-wire", "4-wire"] = "2-wire",
    start: float = 0,
    stop: float = 1,
    points: float = 100,
    measurement_time: float = 1,
    measurement_delay: float = 0.05,
    y_limit: float = 1,
    source_range: float = 1,
) -> OrderedPair:
    """Sweeps current or voltage and measures the opposite for the 2450.

    Requires a CONNECT_2450 block to create the connection.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_2450 block).
    sweep : select, default=voltage
        Select the sweep mode, the opposite unit is measured.
    sense : select, default=2-wire
        Use 2 or 4 wire sense/measurement mode.
    start : float, default=0
        The first x value of the sweep.
    stop : float, default=1
        The last x value of the sweep.
    points : float, default=100
        The number of points between start and stop.
    measurement_time : float, default=1
        How long to measure a single point, in seconds.
    measurement_delay : float, default=0.05
        How long to delay between two points, in seconds.
    y_limit : float, default=1
        The limit of the measured value.
    source_range : float, default=1
        The range of the x value.

    Returns
    -------
    OrderedPair
        Sweep values
    """

    # Retrieve oscilloscope instrument connection
    smu = connection.get_handle()
    smu.commands.reset()

    # Set the source and measure functions.
    if sweep == "current":
        smu.commands.smu.measure.func = smu.commands.smu.FUNC_DC_VOLTAGE
        smu.commands.smu.source.func = smu.commands.smu.FUNC_DC_CURRENT
    else:
        smu.commands.smu.measure.func = smu.commands.smu.FUNC_DC_CURRENT
        smu.commands.smu.source.func = smu.commands.smu.FUNC_DC_VOLTAGE

    # Configure measurement settings.
    smu.commands.smu.terminals = smu.commands.smu.TERMINALS_FRONT
    if sense == "2-wire":
        smu.commands.smu.measure.sense = smu.commands.smu.SENSE_2WIRE
    else:
        smu.commands.smu.measure.sense = smu.commands.smu.SENSE_4WIRE
    smu.commands.smu.measure.autorange = smu.commands.smu.ON
    smu.commands.smu.measure.nplc = measurement_time

    # Configure source settings.
    smu.commands.smu.source.highc = smu.commands.smu.OFF
    smu.commands.smu.source.range = source_range
    smu.commands.smu.source.readback = smu.commands.smu.ON
    if sweep == "current":
        smu.commands.smu.source.vlimit.level = y_limit
    else:
        smu.commands.smu.source.ilimit.level = y_limit
    smu.commands.smu.source.sweeplinear(
        "IVSweep",
        start,
        stop,
        points,
        measurement_delay,
    )

    # Set the operation status bit 0 to high when the trigger model is active.
    # See Event Numbers in 2450 reference manual.
    smu.commands.status.operation.setmap(0, 2731, 2732)
    smu.commands.trigger.model.initiate()

    while True:  # This is needed to wait for the trigger model to complete
        sleep(0.5)
        if not int(smu.commands.status.operation.condition):
            break

    # Get the data from the buffers:
    buffer_data = smu.get_buffers("defbuffer1.sourcevalues", "defbuffer1")
    x = buffer_data["defbuffer1.sourcevalues"]
    y = buffer_data["defbuffer1"]

    return OrderedPair(x=x, y=y)
