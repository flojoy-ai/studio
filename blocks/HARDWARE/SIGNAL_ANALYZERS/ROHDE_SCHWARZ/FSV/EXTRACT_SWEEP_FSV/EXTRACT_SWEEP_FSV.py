from flojoy import flojoy, DataContainer, OrderedPair, VisaConnection
from typing import Optional
from numpy import fromstring
from time import sleep


@flojoy(inject_connection=True)
def EXTRACT_SWEEP_FSV(
    connection: VisaConnection,
    default: Optional[DataContainer] = None,
) -> OrderedPair:
    """Extract the sweep trace from an FSV network analyzer.

    Requires a CONNECTION_FSV block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible R&S network analyzers.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_FSV block).

    Returns
    -------
    OrderedPair
        The sweep trace from the FSV is returned.
    """

    rohde = connection.get_handle()

    # Wait until the sweep count reach the target.
    target = rohde.query("SWE:COUN?")
    while rohde.query("SWE:COUN:CURR?") != target:
        rohde.write("*WAI")
        sleep(0.1)

    x = fromstring(rohde.query("TRAC:DATA:X? TRACE1"), sep=",")
    y = fromstring(rohde.query("TRAC? TRACE1"), sep=",")

    return OrderedPair(x=x, y=y)
