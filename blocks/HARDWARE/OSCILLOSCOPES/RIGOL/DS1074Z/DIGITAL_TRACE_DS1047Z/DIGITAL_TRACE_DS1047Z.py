from flojoy import flojoy, DataContainer, OrderedPair, VisaConnection
from typing import Optional
from numpy import linspace, array, multiply


@flojoy(inject_connection=True)
def DIGITAL_TRACE_DS1047Z(
    connection: VisaConnection,
    channel: int = 0,
    default: Optional[DataContainer] = None,
) -> OrderedPair:
    """Extracts a traces from one of the digital channels (e.g D0).

    Requires a CONNECTION_DS1074Z node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_DS1074Z node).
    channel: int
        Set the triggering channel, from 0-15.
    level: float
        The triggering level, in V.
    slope: select
        Which slope to detect the triggering time on.

    Returns
    -------
    DataContainer
        String: summary of channel settings.
    """

    rigol = connection.get_handle()

    assert 0 <= channel <= 15, "The channel must be between 0 and 15."

    rigol.write_raw(":WAVeform:FORMat WORD")
    rigol.write_raw(f":WAVeform:SOURce D{channel}")

    xorigin = rigol.query_raw("WAVeform:XORigin?")
    xincrem = rigol.query_raw("WAVeform:XINCrement?")
    npts = rigol.query_raw("WAV:POIN?")
    x = linspace(xorigin, npts * xincrem + xorigin, npts)

    raw_trace_val = rigol.root_instrument.visa_handle.query_binary_values(
        "WAV:DATA?", datatype="h", is_big_endian=False, expect_termination=False
    )
    y_ori = rigol.query_raw("WAVeform:YORigin?")
    y_increm = rigol.query_raw("WAVeform:YINCrement?")
    y_ref = rigol.query_raw(":WAVeform:YREFerence?")
    y_raw = array(raw_trace_val)
    y_raw_shifted = y_raw - y_ori - y_ref
    y = multiply(y_raw_shifted, y_increm)

    return OrderedPair(x=x, y=y)
