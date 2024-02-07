from flojoy import flojoy, Vector, Scalar
import scipy.stats


@flojoy
def BINOM_TEST(
    k: Scalar,
    n: int = 2,
    p: float = 0.5,
    alternative: str = "two-sided",
) -> Vector:
    """The BINOM_TEST node is based on a numpy or scipy function.

    The description of that function is as follows:

        Perform a test that the probability of success is p.

    Note: 'binom_test' is deprecated; it is recommended that 'binomtest' be used instead.

        This is an exact, two-sided test of the null hypothesis that the probability of success in a Bernoulli experiment is 'p'.

    Parameters
    ----------
    k : Scalar
        int, aka k. The number of successes.
    n : int
        The number of trials.  This is ignored if x gives both the
        number of successes and failures.
    p : float, optional
        The hypothesized probability of success. 0 <= p <= 1.
        The default value is p = 0.5.
    alternative : {'two-sided', 'greater', 'less'}, optional
        Indicates the alternative hypothesis.
        The default value is 'two-sided'.

    Returns
    -------
    DataContainer
        type Vector with 2 values: statistic and pvalue.
    """

    result = scipy.stats.binomtest(
        k=k.c,
        n=n,
        p=p,
        alternative=alternative,
    )

    result = [result.statistic, result.pvalue]

    return Vector(v=result)
