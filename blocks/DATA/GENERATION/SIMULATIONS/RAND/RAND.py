import random
from typing import Literal, Optional

import numpy as np
from flojoy import DataContainer, Scalar, Vector, display, flojoy


@flojoy
def RAND(
    default: Optional[DataContainer] = None,
    distribution: Literal["normal", "uniform", "poisson"] = "normal",
    size: int = 1000,
    lower_bound: float = 0,
    upper_bound: float = 1,
    normal_mean: float = 0,
    normal_standard_deviation: float = 1,
    poisson_events: float = 1,
) -> Vector | Scalar:
    """Generate a random number or Vector of random numbers, depending on the distribution selected.

    Inputs
    ------
    default : DataContainer
        unused in this node

    Parameters
    ----------
    distribution : select
        the distribution over the random samples
    size : int
        the size of the output. =1 outputs Scalar, >1 outputs Vector
    lower_bound : float
        the lower bound of the output interval
    upper_bound : float
        the upper bound of the output interval
    normal_mean : float
        the mean or "center" of the normal distribution
    normal_standard_deviation : float
        the spread or "width" of the normal distribution
    poisson_events : float
        the expected number of events occurring in a fixed time-interval when distribution is poisson

    Returns
    -------
    Scalar|Vector
        Vector if size > 1
        v: the random samples

        Scalar if size = 1
        c: the random number
    """

    assert size >= 1, "Size must be greater than or equal to than 1"

    if upper_bound < lower_bound:
        upper_bound, lower_bound = lower_bound, upper_bound

    seed = random.randint(1, 10000)
    my_generator = np.random.default_rng(seed)

    match distribution:
        case "uniform":
            y = my_generator.uniform(low=lower_bound, high=upper_bound, size=size)
        case "normal":
            y = my_generator.normal(
                loc=normal_mean, scale=normal_standard_deviation, size=size
            )
        case "poisson":
            y = my_generator.poisson(lam=poisson_events, size=size)

    if size > 1:
        return Vector(v=y)

    return Scalar(c=float(y[0]))


@display
def OVERLOAD(size, lower_bound, upper_bound, distribution="uniform") -> None:
    return None


@display
def OVERLOAD(  # noqa: F811
    size, normal_mean, normal_standard_deviation, distribution="normal"
) -> None:
    return None


@display
def OVERLOAD(size, poisson_events, distribution="poisson") -> None:  # noqa: F811
    return None
