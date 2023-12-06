import random
from typing import Literal

import numpy as np
from flojoy import OrderedPair, Vector, display, flojoy


@flojoy
def POPULATE(
    default: OrderedPair | Vector,
    distribution: Literal["normal", "uniform", "poisson"] = "normal",
    lower_bound: float = 0,
    upper_bound: float = 1,
    normal_mean: float = 0,
    normal_standard_deviation: float = 1,
    poisson_events: float = 1,
) -> OrderedPair:
    """Generate an OrderedPair of random numbers, depending on the distribution selected and the input data.

    Inputs
    ------
    default : OrderedPair|Vector
        Input to use as the x-axis for the random samples.

    Parameters
    ----------
    distribution : select
        the distribution over the random samples
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
    OrderedPair
        x: provided from input data
        y: the random samples
    """

    if upper_bound < lower_bound:
        upper_bound, lower_bound = lower_bound, upper_bound

    seed = random.randint(1, 10000)
    my_generator = np.random.default_rng(seed)

    match default:
        case OrderedPair():
            size = len(default.x)
            x = default.x
        case Vector():
            size = len(default.v)
            x = default.v

    match distribution:
        case "uniform":
            y = my_generator.uniform(low=lower_bound, high=upper_bound, size=size)
        case "normal":
            y = my_generator.normal(
                loc=normal_mean, scale=normal_standard_deviation, size=size
            )
        case "poisson":
            y = my_generator.poisson(lam=poisson_events, size=size)

    return OrderedPair(x=x, y=y)


@display
def OVERLOAD(lower_bound, upper_bound, distribution="uniform") -> None:
    return None


@display
def OVERLOAD(  # noqa: F811
    normal_mean, normal_standard_deviation, distribution="normal"
) -> None:
    return None


@display
def OVERLOAD(poisson_events, distribution="poisson") -> None:  # noqa: F811
    return None
