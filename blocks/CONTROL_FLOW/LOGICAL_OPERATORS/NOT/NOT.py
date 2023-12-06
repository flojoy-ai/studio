from flojoy import flojoy, Boolean


@flojoy
def NOT(default: Boolean) -> Boolean:
    """Takes a boolean data type and computs logical NOT operation on them.

    Parameters
    ----------
    default : Boolean
        The input boolean to which we apply the NOT operation.

    Returns
    -------
    Boolean
        The boolean result from the operation of the input.
    """
    reverse = not default.b
    return Boolean(b=reverse)
