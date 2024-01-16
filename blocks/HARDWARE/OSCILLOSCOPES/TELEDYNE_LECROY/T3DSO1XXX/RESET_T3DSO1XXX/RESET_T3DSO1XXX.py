from flojoy import flojoy, DataContainer, VisaConnection
from typing import Optional
from time import sleep
import logging


@flojoy(inject_connection=True)
def RESET_T3DSO1XXX(
    connection: VisaConnection,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Resets an T3DSO1000(A)-2000 oscilloscope.

    This is the same as pressing [Default] on the front panel.

    Requires a CONNECT_T3DSO1XXX block at the start of the app to connect with
    the instrument. The VISA address will then be listed under 'connection'.

    This block should work with any Teledyne LeCroy T3DSO1000(A)-2000 series oscilloscope.

    Parameters
    ----------
    connection: VisaConnection
        The VISA address (requires the CONNECT_T3DSO1XXX block).

    Returns
    -------
    Optional[DataContainer]
        None
    """

    scope = connection.get_handle()
    scope.write("*RST")

    try_nb = 0

    # Wait for the scope to reset
    while True:
        logging.info("Waiting for scope to reset ...")
        try:
            scope.query("INR?")
        except Exception as e:
            if "VI_ERROR_IO (-1073807298)" in str(e) and try_nb < 10:
                sleep(2)
                try_nb += 1
                continue
            else:
                raise e
        break

    sleep(1)  # Extra time to make sure the scope is ready

    return None
