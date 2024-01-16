from flojoy import flojoy, DataContainer, VisaConnection, Scalar
from typing import Optional, Literal
import re
import logging
from time import sleep


@flojoy(inject_connection=True)
def MEASUREMENT_T3DSO1XXX(
    connection: VisaConnection,
    trace: Literal["C1", "C2", "C3", "C4"] = "C1",
    measurement: Literal[
        "Vertical peak-to-peak",
        "Maximum vertical value",
        "Minimum vertical value",
        "Vertical amplitude",
        "Waveform top value",
        "Waveform base value",
        "Average value in the first cycle",
        "Average value",
        "RMS value",
        "RMS value in the first cycle",
        "Overshoot of a falling edge",
        "Preshoot of a falling edge",
        "Overshoot of a rising edge",
        "Preshoot of a rising edge",
        "Period",
        "Frequency",
        "Positive pulse width",
        "Negative pulse width",
        "Rise-time",
        "Fall-time",
        "Burst width",
        "Positive duty cycle",
        "Negative duty cycle",
    ] = "Vertical peak-to-peak",
    statistic: Literal[
        "Instant",
        "Mean",
        "Min",
        "Max",
        "Std-dev",
        "count",
    ] = "Instant",
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Take a measurement from an T3DSO1000(A)-2000 oscilloscope.

    Install, starts, and get the measurement of the specified source.

    Requires a CONNECT_T3DSO1XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.
    Requires a STATISTIC_TOGGLE_T3DSO block to be enabled to get the statistics.

    This block should work with any Teledyne LeCroy T3DSO1000(A)-2000 series oscilloscope.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECT_T3DSO1XXX block).
    trace: Literal
        The trace to read the waveform from.
    measurement: Literal
        The name of the measurement to take.
    statistic: Literal
        The statistic to take.
    default: DataContainer
        The input data container.

    Returns
    -------
    Scalar
        The measured value.
    """

    MEASUREMENT_MODES_T3DSO = {
        "Vertical peak-to-peak": "PKPK",
        "Maximum vertical value": "MAX",
        "Minimum vertical value": "MIN",
        "Vertical amplitude": "AMPL",
        "Waveform top value": "TOP",
        "Waveform base value": "BASE",
        "Average value in the first cycle": "CMEAN",
        "Average value": "MEAN",
        "RMS value": "RMS",
        "RMS value in the first cycle": "CRMS",
        "Overshoot of a falling edge": "OVSN",
        "Preshoot of a falling edge": "FPRE",
        "Overshoot of a rising edge": "OVSP",
        "Preshoot of a rising edge": "RPRE",
        "Period": "PER",
        "Frequency": "FREQ",
        "Positive pulse width": "PWID",
        "Negative pulse width": "NWID",
        "Rise-time": "RISE",
        "Fall-time": "FALL",
        "Burst width": "WID",
        "Positive duty cycle": "DUTY",
        "Negative duty cycle": "NDUTY",
    }

    def enable_statistic(scope):
        """
        To enable statistic, scope need to be in the "Measurement On && Statistics On" state.
        To enable statistic, "Measurement" need to be enabled.
        """

        def is_statistic_enabled():
            scope.write("PACU FREQ,C1")
            return "STAT1:OFF" not in scope.query("PAVA? STAT1")

        if is_statistic_enabled():
            return

        scope.write("SY_FP 4,1")  # Enable statistic
        sleep(1)
        if is_statistic_enabled():
            return

        # Measurement was off, enable measurement
        scope.write("SY_FP 26,1")  # Enable measurement
        sleep(1)
        if is_statistic_enabled():
            return
        else:
            scope.write("SY_FP 4,1")
            sleep(1)
        assert is_statistic_enabled(), "Failed to enable statistic"

    scope = connection.get_handle()

    install_and_start_measurement_cmd = (
        f"PACU {MEASUREMENT_MODES_T3DSO[measurement]},{trace}"
    )
    scope.write(install_and_start_measurement_cmd)

    m = None
    if statistic == "Instant":
        get_m_cmd = f"{trace}:PAVA? {MEASUREMENT_MODES_T3DSO[measurement]}"
        m = scope.query(get_m_cmd)
        m = m.strip("\n").split(",")[1]
    else:
        # Find the statistics - New statistics are added to the end of the statistic table
        enable_statistic(scope)
        stat_name = f"{trace} {MEASUREMENT_MODES_T3DSO[measurement]}".lower()
        stat_value = None
        for stat_idx in range(5, 0, -1):
            # Ex: "STAT4 C2 AMPL:cur,3.260000E+00,mean,3.260000E+00,..."
            name, values = (
                scope.query(f"PAVA? STAT{stat_idx}").lower().strip("\n").split(":")
            )
            if stat_name in name:
                stat_value = values
                break
        if stat_value is None:
            raise Exception(
                f"Could not find the statistics of {measurement}, is the statistic block enable?"
            )

        # Get the statistics for the trace and measurement
        pairs = stat_value.split(",")
        value = {pairs[i]: pairs[i + 1] for i in range(0, len(pairs), 2)}
        m = value[statistic.lower()].upper()
        if m is None:
            raise ValueError(f"Could not find the statistic {statistic}")

    # Revome unit from the measurement (if present)
    logging.info(f"Measurement: {m}")
    match = re.search(r"E[+-]\d{2}", m)
    m = m[: match.end()] if match is not None else m

    return Scalar(float(m))
