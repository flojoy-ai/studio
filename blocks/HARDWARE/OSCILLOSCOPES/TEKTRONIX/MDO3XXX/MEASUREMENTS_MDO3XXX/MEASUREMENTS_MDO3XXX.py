from flojoy import flojoy, DataContainer, Scalar, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def MEASUREMENTS_MDO3XXX(
    connection: VisaConnection,
    channel: int = 0,
    measurement: Literal["period", "frequency", "amplitude"] = "period",
    statistic: Literal["instant", "mean", "max", "min", "stdev"] = "instant",
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Extract waveform measurements from an MDO3XXX oscilloscope.

    This block can select from three different waveform measurements:
    frequency, period, and amplitude. Also available are 5 statistic modes:
    instant, mean, max, min, and stdev where instant is a single measurement
    and stdev is the standard deviation of the mean.

    Units are in seconds, Hz, and V for frequency, period, and amplitude respectively.

    Requires a CONNECTION_MDO3XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible Tektronix scopes (untested):
    MDO4xxx, MSO4xxx, and DPO4xxx.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX block).
    measurement: str
        The measurement to extract from the scope.
    statistic: str
        The statistic mode to use for the measurement.

    Returns
    -------
    DataContainer
        Scalar: The waveform measurement in the selected statistic mode.
    """

    tek = connection.get_handle()

    tek.measurement[0].source1(f"CH{int(channel + 1)}")

    match measurement:
        case "frequency":
            chan = tek.measurement[0].source1()
            if statistic == "instant":
                value = tek.measurement[0].frequency()
            else:
                value = getattr(tek.measurement[0].frequency, statistic)
                value = value()
            unit = tek.measurement[0].frequency.unit
            print(f"Frequency of signal at channel {chan}: {value:.2E} {unit}")

        case "period":
            chan = tek.measurement[0].source1()
            if statistic == "instant":
                value = tek.measurement[0].period()
            else:
                value = getattr(tek.measurement[0].period, statistic)
                value = value()
            unit = tek.measurement[0].period.unit
            print(f"Period of signal at channel {chan}: {value:.2E} {unit}")

        case "amplitude":
            chan = tek.measurement[0].source1()
            if statistic == "instant":
                value = tek.measurement[0].amplitude()
            else:
                value = getattr(tek.measurement[0].amplitude, statistic)
                value = value()
            unit = tek.measurement[0].amplitude.unit
            print(f"Amplitude of signal at channel {chan}: {value:.2E} {unit}")

    return Scalar(c=value)
