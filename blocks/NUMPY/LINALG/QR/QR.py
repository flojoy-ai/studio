from flojoy import flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import numpy.linalg


@flojoy
def QR(
    default: Matrix,
    mode: str = "reduced",
    select_return: Literal["q", "r", "(h, tau)"] = "q",
) -> Matrix | Scalar:
    """The QR node is based on a numpy or scipy function.

    The description of that function is as follows:

        Compute the qr factorization of a matrix.

        Factor the matrix 'a' as *qr*, where 'q' is orthonormal and 'r' is upper-triangular.

    For the 'mode' parameters, the options 'reduced', 'complete, and 'raw' are new in numpy 1.8 (see the notes for more information).
    The default is 'reduced', and to maintain backward compatibility with earlier versions of numpy, both it and the old default 'full' can be omitted.
    Note that array h returned in 'raw' mode is transposed for calling Fortran.
    The 'economic' mode is deprecated.
    The modes 'full' and 'economic' may be passed using only the first letter for backwards compatibility,
    but all others must be spelled out (see the Notes for further explanation).

    Parameters
    ----------
    select_return : 'q', 'r', '(h, tau)'
        Select the desired opject to return.
        See the respective function docs for descriptors.
    a : array_like, shape (..., M, N)
        An array-like object with the dimensionality of at least 2.
    mode : {'reduced', 'complete', 'r', 'raw'}, optional
        If K = min(M, N), then:
            'reduced' : returns q, r with dimensions (..., M, K), (..., K, N) (default)
            'complete' : returns q, r with dimensions (..., M, M), (..., M, N)
            'r' : returns r only with dimensions (..., K, N)
            'raw' : returns h, tau with dimensions (..., N, M), (..., K,)

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.qr(
        a=default.m,
        mode=mode,
    )

    return_list = ["q", "r", "(h, tau)"]
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
