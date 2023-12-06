from flojoy import flojoy, Matrix, Scalar
import numpy as np
from typing import Literal

import numpy.linalg


@flojoy
def SVD(
    default: Matrix,
    full_matrices: bool = True,
    compute_uv: bool = True,
    hermitian: bool = False,
    select_return: Literal["u", "s", "vh"] = "u",
) -> Matrix | Scalar:
    """The SVD node is based on a numpy or scipy function.

    The description of that function is as follows:

        Singular Value Decomposition.

        When 'a' is a 2D array, and "full_matrices=False", then it is factorized as "u @ np.diag(s) @ vh = (u * s) @ vh",
        where 'u' and the Hermitian transpose of 'vh' are 2D arrays with orthonormal columns and 's' is a 1D array of 'a' singular values.

        When 'a' is higher-dimensional, SVD is applied in stacked mode as explained below.

    Parameters
    ----------
    select_return : 'u', 's', 'vh'
        Select the desired object to return.
        See the respective function docs for descriptors.
    a : (..., M, N) array_like
        A real or complex array with "a.ndim >= 2".
    full_matrices : bool, optional
        If True (default), 'u' and 'vh' have the shapes "(..., M, M)" and "(..., N, N)", respectively.
        Otherwise, the shapes are "(..., M, K)" and "(..., K, N)", respectively, where "K = min(M, N)".
    compute_uv : bool, optional
        Whether or not to compute 'u' and 'vh' in addition to 's'.
        True by default.
    hermitian : bool, optional
        If True, 'a' is assumed to be Hermitian (symmetric if real-valued), enabling a more efficient method for finding singular values.
        Defaults to False.

    .. versionadded:: 1.17.0

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = numpy.linalg.svd(
        a=default.m,
        full_matrices=full_matrices,
        compute_uv=compute_uv,
        hermitian=hermitian,
    )

    return_list = ["u", "s", "vh"]
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
