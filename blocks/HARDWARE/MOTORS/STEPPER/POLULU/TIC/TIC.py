from time import sleep
from typing import Optional

from flojoy import OrderedPair, flojoy
from ticlib import (
    TicUSB,
)  # Import the TicUSB library to send command to Tic drivers with USB connection


@flojoy(deps={"ticlib": "0.2.2"})
def TIC(
    default: Optional[OrderedPair] = None,
    current_limit: int = 30,
    sleep_time: int = 2,
    speed: int = 100000,
) -> OrderedPair:
    """Control a stepper motor's movement through a Polulu TIC driver.

    The user defines the speed and the sleep time between movements.

    (To choose the position, use the STEPPER_DRIVER_TIC_KNOB.)

    Parameters
    ----------
    default : OrderedPair, optional
        The default positions to move the stepper motor to, by default None
    current_limit : int
        Defines the current limitation that the stepper motor will receive.
    sleep_time : int
        Defines the sleep time after moving to each position.
    speed : int
        Defines the speed of the motor movement (between 0 and 200000).

    Returns
    -------
    OrderedPair
    """

    # Setting default positions
    positions: list[int] = [50, 100, 150, 200]

    # Declaration of the stepper driver
    tic: TicUSB = TicUSB()
    tic.halt_and_set_position(0)  # Set the position to 0
    # Set the current limit of the TIC driver
    tic.set_current_limit(current_limit)
    tic.energize()  # Turn on the driver
    tic.exit_safe_start()  # The driver is now ready to receive commands

    for i in range(0, len(positions)):
        tic.set_max_speed(speed)  # Set motor speed
        tic.set_target_position(positions[i])  # Set target positions
        sleep(sleep_time)

    tic.deenergize()
    tic.enter_safe_start()

    return OrderedPair(x=positions, y=positions)
