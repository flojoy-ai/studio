import numpy as np
from flojoy import Matrix, Scalar, Vector, flojoy


@flojoy
def DOT_PRODUCT(a: Matrix | Vector, b: Matrix | Vector) -> Matrix | Vector | Scalar:
    """Take two input matrices, multiply them (by dot product), and return the result.

    To multiply a scalar, use the MULTIPLY block.

    Parameters
    ----------
    a : Matrix
        The input matrix to be multiplied to input b.
    b : Matrix
        The input matrix to be multiplied to input a.

    Returns
    -------
    Matrix
        The matrix result from the matrix multiplication.
    """

    if isinstance(a, Vector) and isinstance(b, Vector):
        assert a.v.shape == b.v.shape, "Vector sizes must be equal."
        return Scalar(c=np.dot(a.v, b.v))
    elif isinstance(a, Matrix) and isinstance(b, Vector):
        assert (
            a.m.shape[0] == b.v.shape[0]
        ), "Vector size must be equal to Matrix column size."
        return Vector(v=np.dot(a.m, b.v))
    elif isinstance(a, Vector) and isinstance(b, Matrix):
        assert (
            a.v.shape[0] == b.m.shape[0]
        ), "Vector size must be equal to Matrix column size."
        return Vector(v=np.dot(a.v, b.m))
    elif isinstance(a, Matrix) and isinstance(b, Matrix):
        assert (
            a.m.shape[1] == b.m.shape[0]
        ), "Matrix 1 row length must be equal to Matrix 2 column length."
        return Matrix(m=np.dot(a.m, b.m))
