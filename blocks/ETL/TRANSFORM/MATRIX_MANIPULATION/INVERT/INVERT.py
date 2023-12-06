import numpy as np
from flojoy import Matrix, OrderedPair, flojoy


@flojoy
def INVERT(default: OrderedPair | Matrix, rcond: float = 1.0) -> OrderedPair | Matrix:
    """Invert a Matrix or OrderedPair.

    If the entered value is a list of scalar, it returns the multiplciative inverse 1/x for each element of the list.

    Inputs
    ------
    default : OrderedPair|Matrix
        The matrix or list of scalar to which we apply the invert.

    Parameters
    ----------
    rcond : float
        Set the rcond used to change small singular values to 0 for a more accurate result when calculating the pseuso-inverse of the matrix.

    Returns
    -------
    OrderedPair|Matrix
        OrderedPair if the default input is an OrderedPair.
        x: the y input list of values.
        y: the list of inverse value of the y input.

        Matrix if the default input is a Matrix.
        m: the inverse matrix of the input.
    """

    a = np.eye(3)
    b: float = rcond

    if isinstance(
        default, OrderedPair
    ):  # v[0] is a DataContainer object with type attribute
        a = default.y  # scalar valued
        return OrderedPair(x=a, y=1 / a)
    elif isinstance(default, Matrix):
        a = default.m
        if not a.shape[0] == a.shape[1]:
            assert isinstance(
                b, float
            ), "Need scalar value to compare SVDs for pseudoinversion"
            retval = np.linalg.pinv(a, rcond=b, hermitian=False)
        else:
            try:
                retval = np.linalg.inv(a)
            except np.linalg.LinAlgError:
                raise ValueError("Inversion failed! Singular matrix returned...")
        return Matrix(m=retval)
