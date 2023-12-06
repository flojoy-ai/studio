from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import scipy.stats


@flojoy
def NORMALTEST(
    default: OrderedPair | Matrix,
    axis: int = 0,
    nan_policy: str = "propagate",
    select_return: Literal["statistic", "pvalue"] = "statistic",
) -> OrderedPair | Matrix | Scalar:
    """The NORMALTEST node is based on a numpy or scipy function.

    The description of that function is as follows:

        Test whether a sample differs from a normal distribution.

        This function tests the null hypothesis that a sample comes from a normal distribution.
        It is based on D'Agostino and Pearson's [1]_, [2]_ test that combines skewness and kurtosis to produce an omnibus test of normality.

    Parameters
    ----------
    select_return : 'statistic', 'pvalue'
        Select the desired object to return.
        See the respective function docs for descriptors.
    a : array_like
        The array containing the sample to be tested.
    axis : int or None, optional
        Axis along which to compute test.
        Default is 0.
        If None, compute over the whole array 'a'.
    nan_policy : {'propagate', 'raise', 'omit'}, optional
        Defines how to handle when input contains nan.
        The following options are available (default is 'propagate'):
        'propagate' : returns nan
        'raise' : raises an error
        'omit' : performs the calculations ignoring nan values

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.normaltest(
        a=default.y,
        axis=axis,
        nan_policy=nan_policy,
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
