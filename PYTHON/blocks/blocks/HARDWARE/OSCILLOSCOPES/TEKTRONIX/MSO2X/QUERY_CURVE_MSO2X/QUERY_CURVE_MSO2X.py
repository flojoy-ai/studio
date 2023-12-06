from typing import Optional
from flojoy import VisaConnection, flojoy, OrderedPair, DataContainer
from numpy import array, linspace


@flojoy(deps={"tm_devices": "1"}, inject_connection=True)
def QUERY_CURVE_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    channel: int = 1,
) -> OrderedPair:
    """Returns the curve query on a MSO2X oscilloscope, in voltage vs time.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    channel : int, default=1
        Oscilloscope channel to query (eg 1 or 2 for a 2 channel scope)

    Returns
    -------
    OrderedPair
        Curve query results, in voltage vs time.
    """

    # Retrieve oscilloscope instrument connection.
    scope = connection.get_handle()

    # Retrieve y axis and convert to voltage.
    scope.commands.data.source.write(channel)
    y = scope.curve_query(channel)
    y = array(y, dtype=float)
    num_bytes = scope.commands.wfmoutpre.byt_nr.query()
    y /= 2 ** (8 * int(num_bytes))
    y *= 5 * float(scope.query(f"CH{channel}:SCAL?"))

    # Calculate the x axis from horizontal parameters.
    x_divs = float(scope.commands.horizontal.divisions.query())
    x_scale = float(scope.commands.horizontal.scale.query())
    x_scale *= x_divs
    x_shift = float(scope.commands.horizontal.position.query()) / -100
    x = linspace(x_scale * x_shift, x_scale * (x_shift + 1), num=y.shape[0])

    return OrderedPair(x=x, y=y)
