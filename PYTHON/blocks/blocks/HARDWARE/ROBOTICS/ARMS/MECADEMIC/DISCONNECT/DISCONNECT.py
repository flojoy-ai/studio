from flojoy import flojoy, TextBlob
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle


@flojoy(deps={"mecademicpy": "1.4.0"})
def DISCONNECT(ip_address: TextBlob) -> None:
    """
    DISCONNECT disconnects the Mecademic robot arm via its API. This is required if the arm is to be used without rebooting.
    Parameters
    ----------
    Parameters
    ----------
    ip_address: TextBlob
        The IP address of the robot arm.

    Returns
    -------
    None
    """

    robot = query_for_handle(ip_address.text_blob)

    robot.WaitIdle()

    robot.DeactivateRobot()
    robot.WaitDeactivated()

    robot.Disconnect()
    robot.WaitSimDeactivated()
    robot.WaitDisconnected()

    return None
