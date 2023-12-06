from flojoy import flojoy, DataContainer, TextBlob, VisaConnection
from typing import Optional


@flojoy(inject_connection=True)
def RETURN_ERRORS_33510B(
    connection: VisaConnection,
    default: Optional[DataContainer] = None,
) -> TextBlob:
    """Return error messages from a supported function generator.

    Error retrival is first-in-first-out (FIFO). Returning errors clears them
    from the instruments queue.

    Requires a CONNECTION_33510B node at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This node should also work with compatible Keysight 33XXX wavefunction
    generators (although they are untested).

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_MDO3XXX node).

    Returns
    -------
    DataContainer
        TextBlob: Returns all errors in the WFG memory.
    """

    ks = connection.get_handle()

    err_code, err_message = ks.error()
    errors = f"{err_code} {err_message}"

    return TextBlob(text_blob=errors)
