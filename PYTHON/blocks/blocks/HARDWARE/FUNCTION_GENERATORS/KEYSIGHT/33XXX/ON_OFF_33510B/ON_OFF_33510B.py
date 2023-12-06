from flojoy import flojoy, DataContainer, TextBlob, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def ON_OFF_33510B(
    connection: VisaConnection,
    on_off: Literal["ON", "OFF"] = "OFF",
    channel: Literal["ch1", "ch2"] = "ch1",
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """Turn the output of a supported function generator on or off.

    Requires a CONNECTION_33510B node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible Keysight 33XXX wavefunction
    generators (although they are untested).

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX node).
    on_off: str
        Whether to turn the waveform generation to on or off.
    channel: str
        The channel to turn on or off.

    Returns
    -------
    DataContainer
        TextBlob: ON or OFF depending on on_off value.
    """

    ks = connection.get_handle()

    channel_str = channel
    channel = getattr(ks, channel)

    channel.output(on_off)

    return TextBlob(text_blob=f"{channel_str}: {on_off}")
