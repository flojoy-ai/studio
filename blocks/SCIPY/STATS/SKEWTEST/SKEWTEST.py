from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import scipy.stats


@flojoy
def SKEWTEST(
    default: OrderedPair | Matrix,
    axis: int = 0,
    nan_policy: str = "propagate",
    alternative: str = "two-sided",
    select_return: Literal["statistic", "pvalue"] = "statistic",
) -> OrderedPair | Matrix | Scalar:
    """The SKEWTEST node is based on a numpy or scipy function.

    The description of that function is as follows:

        Test whether the skewness is different from the normal distribution.

        This function tests the null hypothesis that the skewness of the population that the sample was drawn from is the same as that of a corresponding normal distribution.

    Parameters
    ----------
    select_return : 'statistic', 'pvalue'
        Select the desired object to return.
        See the respective function docs for descriptors.
    a : array
        The data to be tested.
    axis : int or None, optional
        Axis along which statistics are calculated.
        Default is 0.
        If None, compute over the whole array 'a'.
    nan_policy : {'propagate', 'raise', 'omit'}, optional
        Defines how to handle when input contains nan.
        The following options are available (default is 'propagate'):
        'propagate' : returns nan
        'raise' : throws an error
        'omit' : performs the calculations ignoring nan values
    alternative : {'two-sided', 'less', 'greater'}, optional
        Defines the alternative hypothesis.
        Default is 'two-sided'.
        The following options are available:
        'two-sided' : the skewness of the distribution underlying the sample
        is different from that of the normal distribution (i.e. 0)
        'less' : the skewness of the distribution underlying the sample
        is less than that of the normal distribution
        'greater' : the skewness of the distribution underlying the sample
        is greater than that of the normal distribution

    .. versionadded:: 1.7.0

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.skewtest(
        a=default.y,
        axis=axis,
        nan_policy=nan_policy,
        alternative=alternative,
    )

    return_list = ["statistic", "pvalue"]
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
