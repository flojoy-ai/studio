from flojoy import TextBlob, flojoy
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle


@flojoy(deps={"mecademicpy": "1.4.0"})
def ACTIVATE(ip_address: TextBlob, simulator: bool = False) -> TextBlob:
    """
    Activate the robot arm.

    Parameters
    ----------
    ip_address : TextBlob
        The IP address of the robot arm.
    simulator : bool, default=False
        Whether to activate the simulator or not. Defaults to False.

    Returns
    -------
    ip : TextBlob
        The IP address of the robot arm.

    """
    handle = query_for_handle(ip_address)
    if simulator:
        handle.ActivateSim()
    else:
        handle.ActivateRobot()
    handle.WaitActivated()
    return ip_address
