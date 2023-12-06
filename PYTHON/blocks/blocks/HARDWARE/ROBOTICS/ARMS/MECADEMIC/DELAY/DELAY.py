from flojoy import flojoy, String
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def DELAY(
    ip_address: String,
    time: float,
) -> String:
    """
    Delay the action between two blocks.
    Parameters
    ----------
    Parameters
    ----------
    ip_address: String
        The IP address of the robot arm.

    time: float
        The time of delay in seconds.

    Returns
    -------
    String
        The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)
    robot.Delay(time)
    robot.WaitIdle()
    return ip_address
