from flojoy import OrderedPair, flojoy, Matrix, Scalar
from typing import Literal

import scipy.stats


@flojoy
def MVSDIST(
    default: OrderedPair | Matrix,
    select_return: Literal["mdist", "vdist", "sdist"] = "mdist",
) -> OrderedPair | Matrix | Scalar:
    """The MVSDIST node is based on a numpy or scipy function.

    The description of that function is as follows:

        'Frozen' distributions for mean, variance, and standard deviation of data.

    Parameters
    ----------
    select_return : 'mdist', 'vdist', 'sdist'
        Select the desired object to return.
        See the respective function docs for descriptors.
    data : array_like
        Input array. Converted to 1-D using ravel.
        Requires 2 or more data-points.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = OrderedPair(
        x=default.x,
        y=scipy.stats.mvsdist(
            data=default.y,
        ),
    )

    return result
