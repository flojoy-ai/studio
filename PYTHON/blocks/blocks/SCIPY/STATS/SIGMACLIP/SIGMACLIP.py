from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import scipy.stats


@flojoy
def SIGMACLIP(
    default: OrderedPair | Matrix,
    low: float = 4.0,
    high: float = 4.0,
    select_return: Literal["clipped", "lower", "upper"] = "clipped",
) -> OrderedPair | Matrix | Scalar:
    """The SIGMACLIP node is based on a numpy or scipy function.

    The description of that function is as follows:

        Perform iterative sigma-clipping of array elements.

        Starting from the full sample, all elements outside the critical range are removed,
        i.e. all elements of the input array 'c' that satisfy either of the following conditions::

        c < mean(c) - std(c)*low
        c > mean(c) + std(c)*high

        The iteration continues with the updated sample until no elements are outside the (updated) range.

    Parameters
    ----------
    select_return : This function has returns multiple objects ['clipped', 'lower', 'upper'].
        Select the desired one to return.
        See the respective function docs for descriptors.
    a : array_like
        Data array, will be raveled if not 1-D.
    low : float, optional
        Lower bound factor of sigma clipping. Default is 4.
    high : float, optional
        Upper bound factor of sigma clipping. Default is 4.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.sigmaclip(
        a=default.y,
        low=low,
        high=high,
    )

    return_list = ["clipped", "lower", "upper"]
    if isinstance(result, tuple):
        res_dict = {}
        num = min(len(result), len(return_list))
        for i in range(num):
            res_dict[return_list[i]] = result[i]
        result = res_dict[select_return]
    else:
        result = result._asdict()
        result = result[select_return]

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
