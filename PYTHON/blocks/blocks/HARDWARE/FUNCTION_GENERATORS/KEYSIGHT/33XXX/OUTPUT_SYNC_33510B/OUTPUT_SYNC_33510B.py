from flojoy import flojoy, DataContainer, TextBlob, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def OUTPUT_SYNC_33510B(
    connection: VisaConnection,
    on_off: Literal["ON", "OFF"] = "OFF",
    channel: Literal["1", "2"] = "1",
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """Sync multiple output phases of a supported function generator.

    Can only be turned on for one channel.

    Requires a CONNECTION_33510B node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible Keysight 33XXX wavefunction
    generators (although they are untested).

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX node).
    on_off: str
        Whether to turn the waveform phase syncing on or off.
    channel: str
        The channel to use as the baseline phase.

    Returns
    -------
    DataContainer
        TextBlob: The channel, and ON or OFF depending on on_off value.
    """

    ks = connection.get_handle()

    ks.sync.source(int(channel))
    match on_off:
        case "OFF":
            ks.sync.output("OFF")
        case "ON":
            ks.sync.output("ON")
            ks.write("PHAS:SYNC")

    return TextBlob(text_blob=f"CH{channel} sync: {on_off}")
