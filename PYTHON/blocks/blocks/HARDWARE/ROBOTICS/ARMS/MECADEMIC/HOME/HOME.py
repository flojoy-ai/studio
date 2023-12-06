from flojoy import flojoy, String
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def HOME(ip_address: String) -> String:
    """
    Home the robot arm. This block is required to be run before any other robot arm movement. It is recommended to run this block immediately after "ACTIVATE". The robot is expected to move a little bit during the running of this node.

    Parameters
    ----------
    Parameters
    ----------
    ip_address: String
        The IP address of the robot arm.

    Returns
    -------
    String
        The IP address of the robot arm.
    """
    robot = query_for_handle(ip_address)
    robot.Home()
    robot.WaitHomed()
    return ip_address
