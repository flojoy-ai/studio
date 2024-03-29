from typing import List, Tuple
import math


# Max velocities of each joint in degrees per second
JOINT_VELOCITIES = [150, 150, 180, 300, 300, 500]


def calculate_limiting_max_vel(
    current: List[float], next: List[float], time_delta: int
) -> float:
    """
    Calculate the limiting maximum velocity for a robot's joints during a movement.

    Arguments:
    - current: List[float] -- The joints' present position (6 element array of numbers)
    - next: List[float] -- The next position the joints will go to
    - time_delta: int -- The amount of time (in milliseconds) that the move should take

    Returns:
    - float: The limiting maximum velocity as a percentage of the maximum joint velocities.
    """
    if len(current) != 6 or len(next) != 6:
        raise ValueError("Both 'current' and 'next' must be 6 element arrays.")

    if time_delta <= 0:
        raise ValueError("time_delta must be a positive integer.")

    # Calculate the delta positions of each joint in degrees
    delta_positions = [abs(current[i] - next[i]) for i in range(6)]

    # Calculate the required velocities of each joint in degrees per second
    required_velocities = [delta_positions[i] / (time_delta / 1000) for i in range(6)]

    # Calculate the velocity ratios and find the joint with the highest ratio
    velocity_ratios = [required_velocities[i] / JOINT_VELOCITIES[i] for i in range(6)]
    highest_vel_ratio, idx_of_joint_to_limit = max(
        (val, idx) for idx, val in enumerate(velocity_ratios)
    )

    # If the highest velocity ratio is greater than 1, the movement is not possible within the given time_delta
    if highest_vel_ratio > 1:
        print(
            "WARNING: The target velocity is higher than the max velocity of the joint. The joint will be limited to 100% of its max velocity."
        )

    # Return the limiting maximum velocity as a percentage
    return min(100, highest_vel_ratio * 100)


def get_circle_positions(
    radius: float,
    revolutions: float,
    center: Tuple[float, float, float],
    smoothness: int = 360,
) -> List[List[float]]:
    """
    Generate positions for a circular path.

    Arguments:
    - radius: float -- The radius of the circle.
    - revolutions: float -- The number of revolutions of the circle.
    - center: Tuple[float, float, float] -- The (X, Y, Z) coordinates of the center of the circle.
    - smoothness: int -- The number of points per revolution to generate. Default is 360.

    Returns:
    - List[List[float]]: A list of positions (X, Y, Z) along the circular path.
    """
    if smoothness <= 0:
        raise ValueError("Smoothness must be a positive integer")

    center_X, center_Y, center_Z = center
    positions = []
    steps = int(revolutions * smoothness)
    for i in range(steps):
        angle = (2 * math.pi * i) / smoothness
        positions.append(
            [
                center_X + radius * math.cos(angle),
                center_Y + radius * math.sin(angle),
                center_Z,
            ]
        )
    return positions
