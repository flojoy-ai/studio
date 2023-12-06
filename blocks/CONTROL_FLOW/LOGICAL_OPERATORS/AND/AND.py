from flojoy import flojoy, Boolean


@flojoy
def AND(default: Boolean, a: Boolean) -> Boolean:
    """Takes two boolean data type and computs logical AND operation on them.

    Parameters
    ----------
    default : Boolean
        The input boolean to which we apply the AND operation.
    a : Boolean
        The input boolean to which we apply the AND operation.

    Returns
    -------
    Boolean
        The boolean result from the operation of the inputs.
    """
    if default.b and a.b:
        return Boolean(b=True)
    else:
        return Boolean(b=False)
