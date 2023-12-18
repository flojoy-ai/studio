from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, Scalar


@flojoy(inject_connection=True)
def MEASUREMENT_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    channel: Literal["1", "2", "3", "4"] = "1",
    measurement: Literal[
        "ACRMS",
        "AMPLITUDE",
        "AREA",
        "BASE",
        "BURSTWIDTH",
        "DATARATE",
        "DELAY",
        "FALLSLEWRATE",
        "FALLTIME",
        "FREQUENCY",
        "HIGHTIME",
        "HOLD",
        "LOWTIME",
        "MAXIMUM",
        "MEAN",
        "MINIMUM",
        "NDUTY",
        "NOVERSHOOT",
        "NPERIOD",
        "NWIDTTH",
        "PDUTY",
        "PERIOD",
        "PHASE",
        "PK2PK",
        "POVERSHOOT",
        "PWIDTH",
        "RISESLEWRATE",
        "RISETIME",
        "RMS",
        "SETUP",
        "SKEW",
        "TIMEOUTSIDELEVEL",
        "TIMETOMAX",
        "TIMETOMIN",
        "TOP",
    ] = "FREQUENCY",
) -> Scalar:
    """Measure one of the waveforms for the MSO2X.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    measurement : select, default=period
        The type of measurement to make

    Returns
    -------
    Scalar
        The measured value
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    scope.write(f"MEASUrement:ADDMEAS {measurement}")
    c = scope.query(f"MEASUrement:CH{channel}?")

    return Scalar(c=c)
