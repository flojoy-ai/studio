import numpy as np
from typing import Optional
from flojoy import flojoy, OrderedPair, Matrix


@flojoy
def LEAST_SQUARES(
    a: OrderedPair | Matrix, b: Optional[OrderedPair | Matrix] = None
) -> Matrix | OrderedPair:
    """Perform a least squares regression on the input DataContainer (input can be a Matrix or OrderedPair).

    Parameters
    ----------
    a : OrderedPair|Matrix
        A list of points or a coefficient matrix.
    b : Optional[OrderedPair|Matrix]
        Ordinate or "dependent variable" values.

    Returns
    -------
    OrderedPair or Matrix
        OrderedPair
        x: input matrix (data points)
        y: fitted line computed with returned regression weights

        Matrix
        m: fitted matrix computed with returned regression weights
    """

    if b is None:
        if isinstance(a, OrderedPair):
            x = a.x
            y = a.y
            try:
                a = np.vstack([x, np.ones(len(x))]).T
                p = np.linalg.lstsq(a, y, rcond=None)[0]
            except np.linalg.LinAlgError:
                raise ValueError("Least Square Computation failed.")

            slope, intercept = p[0:-1], p[-1]
            res = slope * x + intercept

            return OrderedPair(x=x, y=res)
        else:
            raise ValueError("For matrix type b must be specified!")
    else:
        if isinstance(a, OrderedPair) and isinstance(b, OrderedPair):
            x = a.y
            y = b.y

            try:
                a = np.vstack([x, np.ones(len(x))]).T
                p = np.linalg.lstsq(a, y, rcond=None)[0]
            except np.linalg.LinAlgError:
                raise ValueError("Least Square Computation failed.")

            slope, intercept = p[0:-1], p[-1]
            print("=============== This is slope: ", slope)
            print("=============== This is intercept: ", intercept)
            res = slope * x + intercept

            return OrderedPair(x=x, y=res)

        elif isinstance(a, Matrix) and isinstance(b, Matrix):
            x = a.m
            y = b.m

            try:
                a = np.vstack([x, np.ones(len(x))]).T
                p = np.linalg.lstsq(a, y, rcond=None)[0]
            except np.linalg.LinAlgError:
                raise ValueError("Least Square Computation failed.")

            slope, intercept = p[0:-1], p[-1]
            res = slope * x + intercept

            return Matrix(m=res)
        else:
            raise ValueError("a and b must be of same type!")
