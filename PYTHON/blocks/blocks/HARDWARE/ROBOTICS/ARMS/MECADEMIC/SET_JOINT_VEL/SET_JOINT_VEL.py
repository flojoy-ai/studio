from flojoy import flojoy, TextBlob
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def SET_JOINT_VEL(ip_address: TextBlob, v: float) -> TextBlob:
    """
    The SET_JOINT_VEL node sets the robot arm's angular velocity for its joints.

    Parameters
    ----------
    v : float
        The angular velocity to be set for each joint.

    Inputs
    ------
    ip_address: TextBlob
        The IP address of the robot arm.


    Returns
    -------
    TextBlob
         The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)
    robot.SetJointVel(v)
    return ip_address
