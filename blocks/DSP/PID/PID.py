from numpy import zeros, append, ndarray
from flojoy import flojoy, Scalar, DefaultParams, SmallMemory

memory_key = "pid-info"


@flojoy(inject_node_metadata=True)
def PID(
    single_input: Scalar,
    default_params: DefaultParams,
    Kp: float = 5,
    Ki: float = 0.0143,
    Kd: float = 356.25,
) -> Scalar:
    """Model a PID (proportional-integral-derivative) system.

    The returned value will be modified according to the PID parameters Kp, Ki, and Kd.

    Inputs
    ------
    single_input : Scalar
        The data to apply the PID function to.

    Parameters
    ----------
    Kp : float
        The proprotional PID parameter.
    Ki : float
        The integral PID parameter.
    Kd : float
        The derivative PID parameter.

    Returns
    -------
    Scalar
        c: The PID function output.
    """

    # First let's get the parameters that won't change
    node_id = default_params.node_id
    # Now we need some memory! We need to keep track of the running
    # integral value of the inputs (regulation errors), as well as
    # the previous 3 values of the regulation error
    data = SmallMemory().read_memory(node_id, memory_key)
    if data is None:
        initialize = True
    elif type(data) == ndarray:
        initialize = False
    else:
        raise TypeError("Issue reading memory from REDIS.")
    integral: int = 0 if initialize else data[0]
    regulation_error_primes = zeros(3) if initialize else data[1:]
    regulation_error = single_input.c

    integral: float = integral + 0.5 * Ki * (
        regulation_error + regulation_error_primes[0]
    )
    output_signal = -1 * (
        Kp * regulation_error
        + integral
        + 0.1667
        * Kd
        * (
            regulation_error
            - regulation_error_primes[2]
            + 3.0 * (regulation_error_primes[0] - regulation_error_primes[1])
        )
    )
    regulation_error_primes[2] = regulation_error_primes[1]
    regulation_error_primes[1] = regulation_error_primes[0]
    regulation_error_primes[0] = regulation_error

    # Now write to memory ...
    SmallMemory().write_to_memory(
        node_id, memory_key, append(integral, regulation_error_primes)
    )

    # ... and return the result
    return Scalar(c=output_signal)
