from flojoy import flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import numpy.linalg


@flojoy
def SLOGDET(
    default: Matrix,
    select_return: Literal["sign", "logdet"] = "sign",
) -> Matrix | Scalar:
    """The SLOGDET node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the sign and (natural) logarithm of the determinant of an array.

        If an array has a very small or very large determinant, then a call to 'det' may overflow or underflow.

        This routine is more robust against such issues, because it computes the logarithm of the determinant rather than the determinant itself.

    Parameters
    ----------
    select_return : 'sign', 'logdet'
        Select the desired object to return.
        See the respective function documents for descriptors.
    a : (..., M, M) array_like
        Input array, has to be a square 2-D array.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.slogdet(
        a=default.m,
    )

    return_list = ["sign", "logdet"]
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
        result = Matrix(m=result)
    else:
        assert isinstance(
            result, np.number | float | int
        ), f"Expected np.number, float or int for result, got {type(result)}"
        result = Scalar(c=float(result))

    return result
