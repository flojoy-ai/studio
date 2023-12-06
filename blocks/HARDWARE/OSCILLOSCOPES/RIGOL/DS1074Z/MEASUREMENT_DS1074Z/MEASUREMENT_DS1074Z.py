from flojoy import flojoy, DataContainer, Scalar, VisaConnection
from typing import Optional, Literal
from numpy import inf
from time import sleep


@flojoy(inject_connection=True)
def MEASUREMENT_DS1074Z(
    connection: VisaConnection,
    channel: Literal["ch1", "ch2", "ch3", "ch4"] = "ch1",
    measurement: Literal[
        "VMAX",
        "VMIN",
        "VPP",
        "VTOP",
        "VBASe",
        "VRMS",
        "PERiod",
        "FREQuency",
        "RTIMe",
        "FTIMe",
        "PWIDth",
        "NWIDth",
        "PDUTy",
        "NDUTy",
        "TVMAX",
        "TVMIN",
    ] = "VMAX",
    stat: Literal["MAX", "MIN", "CURR", "AVER", "DEV"] = "CURR",
    default: Optional[DataContainer] = None,
) -> Scalar:
    """Extract waveform measurements from a DS1074Z oscilloscope.

    Also available are statistics for the measurement such as average and max.
    See the docs page for information on each measurement.

    TODO: add link to docs page

    TODO: ADV_MEASUREMENT block + reference to it here

    Requires a CONNECTION_DS1074Z block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_DS1074Z block).
    channel: select
        The channel to measure.
    measurement: select
        The measurement to extract.
    stat: select
        The statistic to use (e.g. CURR=instant measurement, AVER=average).

    Returns
    -------
    Scalar
        The extracted measurement.
    """

    # For ADV_MEASUREMENT node:
    # '"RDELay", "FDELay", "RPHase", "FPHase", "PPULses" "NPULses", "PEDGes", "NEDGes", "PSLEWrate", "NSLEWrate", '
    # '"MARea", "MPARea", "OVERshoot", "PREShoot", "PVRMS", "VARIance",  "VUPper", "VMID", "VLOWer", "VAMP", "VAVG", '

    rigol = connection.get_handle()

    match channel:
        case "ch1":
            channel = "CHANnel1"
        case "ch2":
            channel = "CHANnel2"
        case "ch3":
            channel = "CHANnel3"
        case "ch4":
            channel = "CHANnel4"

    rigol.write_raw(f":MEAS:STAT:ITEM {measurement},{channel}")
    sleep(0.05)
    measure = rigol.ask_raw(f":MEAS:STAT:ITEM? {stat},{measurement},{channel}")

    if measure == "measure error!":
        measure = inf

    else:
        measure = float(measure)
        if measure > 1e36:
            measure = inf

    return Scalar(c=measure)
