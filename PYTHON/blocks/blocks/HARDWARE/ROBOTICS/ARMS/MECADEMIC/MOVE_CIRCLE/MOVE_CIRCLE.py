from flojoy import flojoy, TextBlob
from PYTHON.utils.mecademic_state.mecademic_calculations import get_circle_positions
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def MOVE_CIRCLE(
    ip_address: TextBlob,
    radius: float = 0.0,
    revolutions: float = 1.0,
) -> TextBlob:
    """
    MOVE CIRCLE is an action node that moves the mecademic robot along a circular path defined by a center point about its current position.. It is equivalent to the combination of generating circle keyframes at the robot's current position and then running move keyframes. This node is useful for executing circular moves in tool relative space. A high blending value is recommended for a smooth circular move.

    Parameters
    ----------
    ip_address: TextBlob
        The IP address of the robot arm.
    radius: float
        The radius of the circle. If not specified, the default value of 0.0 is used.
    revolutions: float
        The number of revolutions to make. If not specified, the default value of 1.0 is used.

    Returns
    -------
    TextBlob
        The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)

    X, Y, Z, alpha, beta, gamma = robot.GetPose()

    positions = get_circle_positions(radius, revolutions, (X, Y, Z))
    for position in positions:
        robot.MoveLin(
            x=position[0],
            y=position[1],
            z=position[2],
            alpha=alpha,
            beta=beta,
            gamma=gamma,
        )
    robot.MoveLin(x=X, y=Y, z=Z, alpha=alpha, beta=beta, gamma=gamma)

    return ip_address
