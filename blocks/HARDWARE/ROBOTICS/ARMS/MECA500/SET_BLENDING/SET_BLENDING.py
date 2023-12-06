from flojoy import flojoy, String
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def SET_BLENDING(ip_address: String, blending: float = 0.0) -> String:
    """
    The SET_BLENDING to make the moves of the robot arm smoother.

    Parameters
    ----------
    blending: float
        The blending factor to use when moving between keyframes. If not specified, the default value of 0.0 is used.
    ip_address: String
        The IP address of the robot arm.


    Returns
    -------
    String
        The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)
    # Set blending

    robot.SetBlending(min(blending, 100.0))
    return ip_address
