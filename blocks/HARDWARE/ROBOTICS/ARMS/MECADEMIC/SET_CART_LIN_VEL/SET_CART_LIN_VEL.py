from flojoy import flojoy, String
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def SET_CART_LIN_VEL(ip_address: String, v: float) -> String:
    """
    Set the robot arm's linear velocity in Cartesian coordinates.

    Parameters
    ----------
    v : float
        The velocity to be set.
    ip_address: String
        The IP address of the robot arm

    Returns
    -------
    ip_address
        The IP address of the robot arm.
    """

    robot = query_for_handle(ip_address)
    robot.SetCartLinVel(v)
    return ip_address
