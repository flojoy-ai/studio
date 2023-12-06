from flojoy import flojoy, TextBlob, DataFrame
from PYTHON.utils.mecademic_state.mecademic_calculations import (
    calculate_limiting_max_vel,
)
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def MOVE_KEYFRAMES(ip_address: TextBlob, keyframes: DataFrame) -> TextBlob:
    """
    The MOVE_KEYFRAMES node linearly moves the robot's tool according to a set of 3d animation style keyframes.

    Parameters
    ----------
    ip_address: TextBlob
        The IP address of the robot arm.
    keyframes: DataFrame
        A dataframe containing the keyframes to move to. The dataframe must have the following columns:
        x, y, z, alpha, beta, gamma, duration. The duration column is the time in seconds to move to the next keyframe.

    Returns
    -------
    TextBlob
        The IP address of the robot arm.

    """
    robot = query_for_handle(ip_address)

    # Data validation
    required_columns = ["x", "y", "z", "alpha", "beta", "gamma", "duration"]
    for column in required_columns:
        if column not in keyframes.columns:
            raise ValueError(f"Keyframes dataframe must have a {column} column")
    # check that all values are numeric
    for column in keyframes.columns:
        if keyframes[column].dtype != "float64":
            raise ValueError(f"Keyframes dataframe column {column} must be numeric")

    # Move execution
    for index, row in keyframes.iterrows():
        vel = calculate_limiting_max_vel(
            robot.GetJoints(),
            [row["x"], row["y"], row["z"], row["alpha"], row["beta"], row["gamma"]],
            row["duration"],
        )
        robot.SetJointVel(vel)
        robot.MoveJoints(
            row["x"], row["y"], row["z"], row["alpha"], row["beta"], row["gamma"]
        )
        robot.WaitIdle(row["duration"])
    return ip_address
