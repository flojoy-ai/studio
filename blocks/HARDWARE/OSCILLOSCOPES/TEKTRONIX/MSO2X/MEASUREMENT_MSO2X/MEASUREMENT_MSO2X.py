from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, Scalar


@flojoy(inject_connection=True)
def MEASUREMENT_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    delete_all: bool = False,
    channel: Literal[
        "1",
        "2",
        "3",
        "4",
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7",
        "D8",
        "D9",
        "D10",
        "D10",
        "D12",
        "D13",
        "D14",
        "D15",
    ] = "1",
    measure_num: int = 1,
    measurement: Literal[
        "acrms",
        "amplitude",
        "area",
        "base",
        "burstwidth",
        "datarate",
        "delay",
        "fallslewrate",
        "falltime",
        "frequency",
        "hightime",
        "hold",
        "lowtime",
        "maximum",
        "mean",
        "minimum",
        "nduty",
        "novershoot",
        "nperiod",
        "nwidtth",
        "pduty",
        "period",
        "phase",
        "pk2pk",
        "povershoot",
        "pwidth",
        "riseslewrate",
        "risetime",
        "rms",
        "setup",
        "skew",
        "timeoutsidelevel",
        "timetomax",
        "timetomin",
        "top",
    ] = "frequency",
    statistic: Literal[
        "mean",
        "minumum",
        "maximum",
        "population",
        "stddev",
    ] = "mean",
) -> Scalar:
    """Measure one of the waveforms for the MSO2X.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    channel : select, default=1
        What channel to extract the measurement from.
    measure_num : int, default=1
        What measurement number to use on the scope.
    measurement : select, default=period
        The type of measurement to make.
    statistic : select, default=mean
        The type of statistic to use for the measurement.

    Returns
    -------
    Scalar
        The measured value
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    if delete_all:
        scope.write("MEASUrement:DELETEALL")

    scope.write(f":MEASUrement:MEAS{measure_num}:TYPE {measurement}")
    if channel[0] == "D":
        scope.write(f":MEASUrement:MEAS{measure_num}:SOURCE DCH1_{channel}")
    else:
        scope.write(f":MEASUrement:MEAS{measure_num}:SOURCE CH{channel}")

    scope.query("*OPC?")
    c = scope.query(f"MEASUrement:MEAS{measure_num}:RESUlts:CURRentacq:{statistic}?")

    return Scalar(c=float(c))
