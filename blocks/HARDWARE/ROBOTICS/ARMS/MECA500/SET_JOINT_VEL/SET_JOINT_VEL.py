from flojoy import flojoy, String
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def SET_JOINT_VEL(ip_address: String, v: float) -> String:
    """
    The SET_JOINT_VEL node sets the robot arm's angular velocity for its joints.

    Parameters
    ----------
    v : float
        The angular velocity to be set for each joint.

    Inputs
    ------
    ip_address: String
        The IP address of the robot arm.


    Returns
    -------
    String
         The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)
    robot.SetJointVel(v)
    return ip_address
