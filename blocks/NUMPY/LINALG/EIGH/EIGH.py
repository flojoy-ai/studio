from flojoy import flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import numpy.linalg


@flojoy
def EIGH(
    default: Matrix,
    UPLO: str = "L",
    select_return: Literal["w", "v"] = "w",
) -> Matrix | Scalar:
    """The EIGH node is based on a numpy or scipy function.

    The description of that function is as follows:

        Return the eigenvalues and eigenvectors of a complex Hermitian (conjugate symmetric) or a real symmetric matrix.

    Parameters
    ----------
    default : Matrix
        The matrix to find the eigenvectors and eigenvalues of.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.eigh(
        a=default.m,
        UPLO=UPLO,
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
