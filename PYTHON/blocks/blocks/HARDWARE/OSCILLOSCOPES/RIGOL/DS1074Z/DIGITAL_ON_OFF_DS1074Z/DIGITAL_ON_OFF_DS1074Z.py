from flojoy import flojoy, DataContainer, TextBlob, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def DIGITAL_ON_OFF_DS1074Z(
    connection: VisaConnection,
    digi_on_off: Literal["ON", "OFF"] = "ON",
    d0: Literal["ON", "OFF"] = "ON",
    d1: Literal["ON", "OFF"] = "ON",
    d2: Literal["ON", "OFF"] = "ON",
    d3: Literal["ON", "OFF"] = "ON",
    use_pods: bool = False,
    pod1: Literal["ON", "OFF"] = "ON",
    pod2: Literal["ON", "OFF"] = "OFF",
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """The DIGITAL_ON_OFF_DS1074Z node turns digital channels on or off for the DS1074Z.

    Requires a CONNECTION_DS1074Z node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_DS1074Z node).
    digi_on_off: select
        Turn digital channel (i.e. LA) on the scope on or off.
    d0: select
        Turn digital channel 0 on or off.
    d1: select
        Turn digital channel 1 on or off.
    d2: select
        Turn digital channel 2 on or off.
    d3: select
        Turn digital channel 3 on or off.
    use_pods: select
        Use pod1 and pod2 parameters? If True, d0-d3 parameters are not used.
    pod1: select
        Turn digital channels 0-7 on or off.
    pod2: select
        Turn digital channels 8-15 on or off.

    Returns
    -------
    DataContainer
        TextBlob: summary of channel settings.
    """

    rigol = connection.get_handle()
    rigol.write_raw(f":LA:STATe {digi_on_off}")

    if not use_pods:
        rigol.write_raw(f":LA:DIG0:DISPlay {d0}")
        rigol.write_raw(f":LA:DIG1:DISPlay {d1}")
        rigol.write_raw(f":LA:DIG2:DISPlay {d2}")
        rigol.write_raw(f":LA:DIG3:DISPlay {d3}")

        s = f"Digital 0: {d0}, "
        s += f"Digital 1: {d1}, "
        s += f"Digital 2: {d2}, "
        s += f"Digital 3: {d3}"

    else:
        rigol.write_raw(f":LA:POD1:DISPlay {pod1}")
        rigol.write_raw(f":LA:POD2:DISPlay {pod2}")

        s = f"Pod 1: {pod1}, "
        s += f"Pod 2: {pod2} "

    return TextBlob(text_blob=s)
