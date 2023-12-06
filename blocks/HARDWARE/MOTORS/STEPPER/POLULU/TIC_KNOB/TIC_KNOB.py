from time import sleep
from typing import Optional

from flojoy import OrderedPair, flojoy

# Import the TicUSB library to send command to Tic drivers with USB connection
from ticlib import TicUSB


@flojoy(deps={"ticlib": "0.2.2"})
def TIC_KNOB(
    default: Optional[OrderedPair] = None,
    knob_value: int = 0,
    current_limit: int = 30,
    sleep_time: int = 2,
    speed: int = 200000,
) -> OrderedPair:
    """Control a stepper motor's movement through a Polulu TIC driver.

    The user controls the motor's rotation with the knob position, specified in the node's parameters.

    Parameters
    ----------
    default : OrderedPair, optional
        The default value of the node, by default None
    knob_value : int
        Defines the position of the motor (rotational movement).
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

    # Converting the knob value into a position
    knob_position: int = 2 * knob_value

    # Declaration of the stepper driver (You can add serial number to specify the driver)
    tic: TicUSB = TicUSB()
    # Set the current limit for the driver TIC
    tic.set_current_limit(current_limit)
    tic.energize()  # Turn on the driver
    tic.exit_safe_start()  # The driver is now ready to receive commands
    # Set maximum speed for the motor during first movement.
    tic.set_max_speed(speed)

    tic.halt_and_set_position(0)  # Set initial position to origin
    sleep(sleep_time)

    # Set target position for the first movement
    tic.set_target_position(knob_position)
    sleep(sleep_time)

    tic.deenergize()
    tic.enter_safe_start()

    return OrderedPair(x=knob_position, y=speed)
