from flojoy import flojoy, TextBlob
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def MOVE_LIN_REL_TRF(
    ip_address: TextBlob,
    x: float,
    y: float,
    z: float,
    alpha: float = 0,
    beta: float = 0,
    gamma: float = 0,
) -> TextBlob:
    """
    The MOVE_LIN node linearly moves the robot's tool to an absolute Cartesian position relative to the robot's tool reference frame which is set by the SET_TRF node.

    Inputs
    ------
    ip_address: TextBlob
        The IP address of the robot arm.

    Parameters
    ----------
    x : float
        The x coordinate of the position to move to
    y : float
        The y coordinate of the position to move to
    z : float
        The z coordinate of the position to move to
    alpha : float
        The alpha coordinate (rotation in radians about the x axis) of the position to move to.
    beta : float
        The beta coordinate   (rotation in radians about the y axis) of the position to move to.
    gamma : float
        The gamma coordinate (rotation in radians about the z axis) of the position to move to.

    Returns
    -------
    TextBlob
        The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)
    robot.MoveLinRelTRF(x=x, y=y, z=z, alpha=alpha, beta=beta, gamma=gamma)
    robot.WaitIdle()
    return ip_address
