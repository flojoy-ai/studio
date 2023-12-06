from flojoy import OrderedPair, flojoy, Matrix, Scalar
import numpy as np

import scipy.stats


@flojoy
def GSTD(
    default: OrderedPair | Matrix,
    axis: int = 0,
    ddof: int = 1,
) -> OrderedPair | Matrix | Scalar:
    """The GSTD node is based on a numpy or scipy function.

    The description of that function is as follows:

        Calculate the geometric standard deviation of an array.

        The geometric standard deviation describes the spread of a set of numbers where the geometric mean is preferred.
        It is a multiplicative factor, and so a dimensionless quantity.

        It is defined as the exponent of the standard deviation of log(a).

        Mathematically the population geometric standard deviation can be evaluated as::

        gstd = exp(std(log(a)))

    .. versionadded:: 1.3.0

    Parameters
    ----------
    a : array_like
        An array like object containing the sample data.
    axis : int, tuple or None, optional
        Axis along which to operate. Default is 0.
        If None, compute over the whole array 'a'.
    ddof : int, optional
        Degree of freedom correction in the calculation of the geometric standard deviation.
        Default is 1.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = scipy.stats.gstd(
        a=default.y,
        axis=axis,
        ddof=ddof,
    )

    if isinstance(result, np.ndarray):
        result = OrderedPair(x=default.x, y=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
