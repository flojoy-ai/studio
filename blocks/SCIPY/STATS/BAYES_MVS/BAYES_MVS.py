from flojoy import OrderedPair, flojoy, Matrix, Scalar

import scipy.stats


@flojoy
def BAYES_MVS(
    default: OrderedPair | Matrix,
    alpha: float = 0.9,
) -> OrderedPair | Matrix | Scalar:
    """The BAYES_MVS node is based on a numpy or scipy function.

    The description of that function is as follows:

        Bayesian confidence intervals for the mean, var, and std.

    Parameters
    ----------
    data : array_like
        Input data, if multi-dimensional it is flattened to 1-D by 'bayes_mvs'.
        Requires 2 or more data points.
    alpha : float, optional
        Probability that the returned confidence interval contains the true parameter.

    Returns
    -------
    DataContainer
        type 'ordered pair', 'scalar', or 'matrix'
    """

    result = OrderedPair(
        x=default.x,
        y=scipy.stats.bayes_mvs(
            data=default.y,
            alpha=alpha,
        ),
    )

    return result
