from flojoy import flojoy, Boolean


@flojoy
def NOT_AND(default: Boolean, a: Boolean) -> Boolean:
    """Takes two boolean data type and computs logical NOT AND operation on them.

    Parameters
    ----------
    default : Boolean
        The input boolean to which we apply the NOT AND operation.
    a : Boolean
        The input boolean to which we apply the NOT AND operation.

    Returns
    -------
    Boolean
        The boolean result from the operation of the inputs.
    """
    if not default.b and not a.b:
        return Boolean(b=True)
    elif (default.b and not a.b) or (not default.b and a.b):
        return Boolean(b=True)
    else:
        return Boolean(b=False)
