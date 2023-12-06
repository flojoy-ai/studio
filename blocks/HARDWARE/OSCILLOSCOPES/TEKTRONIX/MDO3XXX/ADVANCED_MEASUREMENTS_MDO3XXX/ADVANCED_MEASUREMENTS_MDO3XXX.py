from flojoy import flojoy, DataContainer, Scalar, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def ADVANCED_MEASUREMENTS_MDO3XXX(
    connection: VisaConnection,
    channel: int = 0,
    measurement: str = "period",
    statistic: Literal["instant", "mean", "max", "min", "stdev"] = "instant",
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Extract waveform measurements from an MDO3xxx oscilloscope.

    This block is similar to MEASUREMENTS_MDO3XXX block but more measurements
    are availble. The available measurements are as follows:

    amplitude, area, burst, carea, cmean, crms, delay, distduty, extinctdb,
    extinctpct, extinctratio, eyeheight, eyewidth, fall, frequency, high, hits,
    low, maximum, mean, median, minimum, ncross, nduty, novershoot, nwidth,
    pbase, pcross, pctcross, pduty, peakhits, period, phase, pk2pk, pkpkjitter,
    pkpknoise, povershoot, ptop, pwidth, qfactor, rise, rms, rmsjitter,
    rmsnoise, sigma1, sigma2, sigma3, sixsigmajit, snratio, stddev, undefined,
    waveforms

    Also available are 5 statistic modes:
    instant, mean, max, min, and stdev where instant is a single measurement
    and stdev is the standard deviation of the mean.

    Requires a CONNECTION_MDO3XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible Tektronix scopes (untested):
    MDO4xxx, MSO4xxx, and DPO4xxx. Many of the advanced measurements are likely
    to not function with different model numbers.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX block).
    channel: int
        The channel with which to create a measurement for.
    measurement: str
        The measurement to make.
    statistic: str
        The type of statistic to take for the measurement.

    Returns
    -------
    DataContainer
        Scalar: The measurement from the oscilloscope channel.
    """

    measures = {
        "amplitude",
        "area",
        "burst",
        "carea",
        "cmean",
        "crms",
        "delay",
        "distduty",
        "extinctdb",
        "extinctpct",
        "extinctratio",
        "eyeheight",
        "eyewidth",
        "fall",
        "frequency",
        "high",
        "hits",
        "low",
        "maximum",
        "mean",
        "median",
        "minimum",
        "ncross",
        "nduty",
        "novershoot",
        "nwidth",
        "pbase",
        "pcross",
        "pctcross",
        "pduty",
        "peakhits",
        "period",
        "phase",
        "pk2pk",
        "pkpkjitter",
        "pkpknoise",
        "povershoot",
        "ptop",
        "pwidth",
        "qfactor",
        "rise",
        "rms",
        "rmsjitter",
        "rmsnoise",
        "sigma1",
        "sigma2",
        "sigma3",
        "sixsigmajit",
        "snratio",
        "stddev",
        "undefined",
        "waveforms",
    }

    assert (
        measurement in measures
    ), f"The select measurement ({measurement}) is not availble."

    tek = connection.get_handle()

    tek.measurement[0].source1(f"CH{int(channel + 1)}")

    measurement = getattr(tek.measurement[0], measurement)

    if statistic == "instant":
        value = measurement()
    else:
        measurement = getattr(measurement, statistic)
        value = measurement()

    return Scalar(c=value)
