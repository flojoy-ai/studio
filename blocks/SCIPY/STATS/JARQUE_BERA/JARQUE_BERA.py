from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import scipy.stats


@flojoy
def JARQUE_BERA(
    default: OrderedPair | Matrix,
    select_return: Literal["jb_value", "p"] = "jb_value",
) -> OrderedPair | Matrix | Scalar:
    """The JARQUE_BERA node is based on a numpy or scipy function.

    The description of that function is as follows:

        Perform the Jarque-Bera goodness of fit test on sample data.

        The Jarque-Bera test tests whether the sample data has the skewness and kurtosis matching a normal distribution.

        Note that this test only works for a large enough number of data samples (>2000) as the test statistic asymptotically has a Chi-squared distribution with 2 degrees of freedom.

    Parameters
    ----------
    select_return : 'jb_value', 'p'
        Select the desired object to return.
        See the respective function docs for descriptors.
    x : array_like
        Observations of a random variable.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.jarque_bera(
        x=default.y,
    )

    return_list = ["jb_value", "p"]
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
