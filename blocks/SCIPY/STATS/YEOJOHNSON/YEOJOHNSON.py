from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.stats


@flojoy
def YEOJOHNSON(
    default: OrderedPair | Matrix,
    lmbda: float = 0.1,
) -> OrderedPair | Matrix | Scalar:
    """The YEOJOHNSON node is based on a numpy or scipy function.

    The description of that function is as follows:

        Return a dataset transformed by a Yeo-Johnson power transformation.

    Parameters
    ----------
    x : ndarray
        Input array.
        Should be 1-dimensional.
    lmbda : float, optional
        If 'lmbda' is 'None', find the lambda that maximizes the
        log-likelihood function and return it as the second output argument.
        Otherwise the transformation is done for the given value.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.yeojohnson(
        x=default.y,
        lmbda=lmbda,
    )

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
