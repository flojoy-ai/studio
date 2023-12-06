from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import scipy.stats


@flojoy
def ANDERSON(
    default: OrderedPair | Matrix,
    dist: str = "norm",
    select_return: Literal[
        "statistic", "critical_values", "significance_level"
    ] = "statistic",
) -> OrderedPair | Matrix | Scalar:
    """The ANDERSON node is based on a numpy or scipy function.

    The description of that function is as follows:

        Anderson-Darling test for data coming from a particular distribution.

        The Anderson-Darling test tests the null hypothesis that a sample is drawn from a population that follows a particular distribution.
        For the Anderson-Darling test, the critical values depend on which distribution is being tested against.
        This function works for normal, exponential, logistic, or Gumbel (Extreme Value Type I) distributions.

    Parameters
    ----------
    select_return : This function has returns multiple objects ['statistic', 'critical_values', 'significance_level'].
        Select the desired one to return.
        See the respective function docs for descriptors.
    x : array_like
        Array of sample data.
    dist : {'norm', 'expon', 'logistic', 'gumbel', 'gumbel_l', 'gumbel_r', 'extreme1'}, optional
        The type of distribution to test against.
        The default is 'norm'.
        The names 'extreme1', 'gumbel_l' and 'gumbel' are synonyms for the same distribution.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.anderson(
        x=default.y,
        dist=dist,
    )

    return_list = ["statistic", "critical_values", "significance_level"]
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
