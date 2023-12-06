from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def CHANNEL_ON_OFF_DS1074Z(
    connection: VisaConnection,
    ch1: Literal["ON", "OFF"] = "ON",
    ch2: Literal["ON", "OFF"] = "ON",
    ch3: Literal["ON", "OFF"] = "ON",
    ch4: Literal["ON", "OFF"] = "ON",
    default: Optional[DataContainer] = None,
) -> String:
    """Turn the channels on or off for the DS1074Z oscilloscope.

    Requires a CONNECTION_DS1074Z block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should also work with compatible DS1000Z oscilloscopes

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_DS1074Z block).
    ch1: select
        Turn channel 1 on or off.
    ch2: select
        Turn channel 2 on or off.
    ch3: select
        Turn channel 3 on or off.
    ch4: select
        Turn channel 4 on or off.

    Returns
    -------
    String
        Summary of channel settings.
    """

    rigol = connection.get_handle()

    rigol.write_raw(f":CHANnel1:DISPlay {ch1}")
    rigol.write_raw(f":CHANnel2:DISPlay {ch2}")
    rigol.write_raw(f":CHANnel3:DISPlay {ch3}")
    rigol.write_raw(f":CHANnel4:DISPlay {ch4}")

    s = f"Channel 1: {ch1}, "
    s += f"Channel 2: {ch2}, "
    s += f"Channel 3: {ch3}, "
    s += f"Channel 4: {ch4}"

    return String(s=s)
