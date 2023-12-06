import pandas as pd
from flojoy import flojoy, DataFrame
from PYTHON.utils.mecademic_state.mecademic_calculations import get_circle_positions
from PYTHON.utils.mecademic_state.mecademic_helpers import safe_robot_operation


@safe_robot_operation
@flojoy(deps={"mecademicpy": "1.4.0"})
def CALCULATE_CIRCLE_MOVE(
    center_X: float = 0.0,
    center_Y: float = 0.0,
    center_Z: float = 0.0,
    radius: float = 0.0,
    revolutions: float = 1.0,
    point_duration: int = 500,
) -> DataFrame:
    """
    The Calculate Circle Move node moves in a circle relative to a reference plane. This node's output can be fed into a move keyframes node to create a movement along a circular path of a given radius and center point. This is not an opertaion on the robot, just generating keyframes.. It can feed into a move keyframes node to define a move for a Mecademic arm. Blending is recommended for a smooth circular move.

    Parameters
    ----------
    center_X : float
        The X coordinate of the center of the circle. If not specified, the default value of 0.0 is used.
    center_Y : float
        The Y coordinate of the center of the circle. If not specified, the default value of 0.0 is used.
    center_Z : float
        The Z coordinate of the center of the circle. If not specified, the default value of 0.0 is used.
    radius : float
        The radius of the circle. If not specified, the default value of 0.0 is used.
    revolutions : float
        The number of revolutions to make. If not specified, the default value of 1.0 is used.
    point_duration : int
        The duration of each point in milliseconds. If not specified, the default value of 500 is used.
    Returns
    -------
    DataFrame
        A dataframe of keyframes to move to.

    """
    positions = get_circle_positions(radius, revolutions, center_X, center_Y, center_Z)

    df = pd.DataFrame(
        positions, columns=["x", "y", "z", "alpha", "beta", "gamma", "duration"]
    )
    for i in range(0, len(positions)):
        df.loc[i, "x"] = positions[i][0]
        df.loc[i, "y"] = positions[i][1]
        df.loc[i, "z"] = positions[i][2]
        df.loc[i, "alpha"] = 0
        df.loc[i, "beta"] = 0
        df.loc[i, "gamma"] = 0
        df.loc[i, "duration"] = point_duration

    return df
