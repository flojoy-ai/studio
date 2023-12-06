from flojoy import flojoy, Scalar
from scipy import integrate
from sympy import parse_expr, lambdify


@flojoy(deps={"sympy": "1.12"})
def DOUBLE_DEFINITE_INTEGRAL(
    function: str = "",
    upper_bound_x: float = 0.0,
    lower_bound_x: float = 0.0,
    upper_bound_y: float = 0.0,
    lower_bound_y: float = 0.0,
) -> Scalar:
    """Compute the double integral of a symbolic input function.

    Example of proper syntax for the function input:
    2*x*y

    Example of improper syntax for the function input:
    2xy

    Parameters
    ----------
    function : str
        The function that we are integrating.
    upper_bound_x : float
        The upper bound for x.
    lower_bound_x : float
        The lower bound for x.
    upper_bound_y : float
        The upper bound for y.
    lower_bound_y : float
        The lower bound for y.

    Returns
    -------
    Scalar
        The result of the double definite integral.
    """

    func = parse_expr(function)
    symbols = tuple(func.free_symbols)

    f = lambdify(symbols, func)

    result = integrate.nquad(
        f, [(lower_bound_x, upper_bound_x), (lower_bound_y, upper_bound_y)]
    )[0]

    return Scalar(c=result)
