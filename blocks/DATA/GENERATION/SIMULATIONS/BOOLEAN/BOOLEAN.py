from flojoy import flojoy, Boolean


@flojoy
def BOOLEAN(status: bool = True) -> Boolean:
    """Takes one argument as input.
    Based on the input, it generates a boolean type data.
    If the status is True, then it generates true constant, else false constant.

    Parameters
    ----------
    status : bool, default: True
        either True or False value that you want to assign

    Returns
    -------
    Boolean
        Boolean node
    """

    return Boolean(b=status)
