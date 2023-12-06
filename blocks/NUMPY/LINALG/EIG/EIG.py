from flojoy import flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import numpy.linalg


@flojoy
def EIG(
    default: Matrix,
    select_return: Literal["w", "v"] = "w",
) -> Matrix | Scalar:
    """The EIG node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the eigenvalues and right eigenvectors of a square array.

    Parameters
    ----------
    select_return : 'w', 'v'
        Select the desired object to return.
        See the respective function docs for descriptors.
    a : (..., M, M) array
        Matrices for which the eigenvalues and right eigenvectors will be computed.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.eig(
        a=default.m,
    )

    return_list = ["w", "v"]
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
