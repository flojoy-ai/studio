from flojoy import flojoy, OrderedPair


@flojoy(node_type="TEST_TYPE")
def DOCSTRING(a: OrderedPair, b: OrderedPair, foo: int, bar: str) -> OrderedPair:
    """A docstring test.

    Inputs
    ------
    a : OrderedPair
        Does something cool
        over multiple lines
    b : OrderedPair
        Does another cool thing

    Parameters
    ----------
    foo : int
        A number
    bar : str
        A string


    Returns
    -------
    OrderedPair
        The sum of cool things
    """
    return OrderedPair(a.x + b.x, a.y + b.y)
