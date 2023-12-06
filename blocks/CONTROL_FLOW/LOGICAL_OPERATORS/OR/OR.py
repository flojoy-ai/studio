from flojoy import flojoy, Boolean


@flojoy
def OR(default: Boolean, a: Boolean) -> Boolean:
    """Takes two boolean data type and computs logical OR operation on them.

    Parameters
    ----------
    default : Boolean
        The input boolean to which we apply the OR operation.
    a : Boolean
        The input boolean to which we apply the OR operation.

    Returns
    -------
    Boolean
        The boolean result from the operation of the inputs.
    """
    if default.b or a.b:
        return Boolean(b=True)
    return Boolean(b=False)
