from flojoy import flojoy, String
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def SET_TRF(
    ip_address: String,
    rf_x: float = 0.0,
    rf_y: float = 0.0,
    rf_z: float = 0.0,
    rf_a: float = 0.0,
    rf_b: float = 0.0,
    rf_g: float = 0.0,
) -> String:
    """
     The SET_TRF node sets the robot arm's reference frame.

    Inputs
    ------
    ip_address: String
        The IP address of the robot arm.

    Parameters
    ----------
    rf_x: float
        The X coordinate of the reference plane. If not specified, the default value of 0.0 is used.
    rf_y: float
        The Y coordinate of the reference plane. If not specified, the default value of 0.0 is used.
    rf_z: float
        The Z coordinate of the reference plane. If not specified, the default value of 0.0 is used.
    rf_a: float
        The alpha angle of the reference plane. If not specified, the default value of 0.0 is used.
    rf_b: float
        The beta angle of the reference plane. If not specified, the default value of 0.0 is used.
    rf_g: float
        The gamma angle of the reference plane. If not specified, the default value of 0.0 is used.

    Returns
    -------
    String
         The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)
    robot.SetTRF(rf_x, rf_y, rf_z, rf_a, rf_b, rf_g)
    return ip_address
