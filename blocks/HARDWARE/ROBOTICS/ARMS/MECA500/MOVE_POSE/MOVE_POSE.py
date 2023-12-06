from typing import Optional
from flojoy import flojoy, String
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def MOVE_POSE(
    ip_address: String,
    x: float,
    y: float,
    z: float,
    alpha: Optional[float] = 0,
    beta: Optional[float] = 0,
    gamma: Optional[float] = 0,
) -> String:
    """
    Move the robot to a specified pose in space.

    Parameters
    ----------
    x : float
        The x coordinate of the position to move to
    y : float
        The y coordinate of the position to move to
    z : float
        The z coordinate of the position to move to
    alpha : float, optional
        The alpha coordinate (rotation in radians about the x axis) of the position to move to.
    beta : float, optional
        The beta coordinate   (rotation in radians about the y axis) of the position to move to.
    gamma : float, optional
        The gamma coordinate (rotation in radians about the z axis) of the position to move to.
    ip_address
        The IP address of the robot arm.



    Returns
    -------
    String
        The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)
    robot.MovePose(x=x, y=y, z=z, alpha=alpha, beta=beta, gamma=gamma)
    robot.WaitIdle()
    return ip_address
