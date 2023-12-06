from typing import Optional
from flojoy import flojoy, TextBlob
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def MOVE_JOINT(
    ip_address: TextBlob,
    x: float,
    y: float,
    z: float,
    alpha: Optional[float] = 0,
    beta: Optional[float] = 0,
    gamma: Optional[float] = 0,
) -> TextBlob:
    """
    Linearly move the robot's tool to an absolute Cartesian position.

    Parameters
    ----------
    ip_address: TextBlob
        The IP address of the robot arm.
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

    Returns
    -------
    TextBlob
        The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)
    robot.MoveJoints(x, y, z, alpha, beta, gamma)
    robot.WaitIdle()
    return ip_address
