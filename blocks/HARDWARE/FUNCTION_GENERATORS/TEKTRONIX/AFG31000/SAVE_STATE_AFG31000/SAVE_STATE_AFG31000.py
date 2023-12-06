from flojoy import flojoy, DataContainer, String, VisaConnection
from typing import Optional, Literal


@flojoy(inject_connection=True)
def SAVE_STATE_AFG31000(
    connection: VisaConnection,
    save_recall: Literal["save", "recall"] = "save",
    option: Literal["1", "2", "3", "4", "5"] = "1",
    input: Optional[DataContainer] = None,
) -> String:
    """Saves or recalls the state for the AFG31000.

    The channel output state is not save (i.e. if the channel was outputing).

    This block should also work with compatible Tektronix AFG31XXX instruments.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECTION_AFG31000 block).
    save_recall: select, default=save
        Save or recall the save state.
    option: select, default=1
        Choose from the 5 save states.

    Returns
    -------
    String
        Save state
    """

    afg = connection.get_handle()

    if save_recall == "save":
        afg.write(f"*SAV {option}")
    else:
        afg.write(f"*RCL {option}")

    return String(s=f"Save state {option}")
