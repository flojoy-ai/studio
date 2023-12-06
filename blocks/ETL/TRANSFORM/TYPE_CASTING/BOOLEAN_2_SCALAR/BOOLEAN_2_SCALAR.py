from flojoy import flojoy, Boolean, Scalar


@flojoy
def BOOLEAN_2_SCALAR(default: Boolean) -> Scalar:
    """Takes boolean type data and converts it into scalar data type.
    1 means true and 0 means false

    Parameters
    ----------
    default : Boolean
        The input boolean to which we apply the conversion to.
    Returns
    -------
    Scalar
        The scalar result from the conversion of the input.
    """
    if default.b:
        return Scalar(c=1)
    return Scalar(c=0)
