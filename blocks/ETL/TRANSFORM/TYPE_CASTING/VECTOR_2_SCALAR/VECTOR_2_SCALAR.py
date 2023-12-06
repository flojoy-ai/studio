from numpy import bool_, int_
from flojoy import flojoy, Vector, Scalar


@flojoy
def VECTOR_2_SCALAR(default: Vector) -> Scalar:
    """Takes a vector and transform it into scalar data type.
    If the vector consists of all boolean type data, then it reads the vector in binary number where True is 1 and False is 0.
    It then converts the binary number into decimal number.
    If the vector consists of all integer type data, then it sums up all the data and converts it into a scalar type data.

    Parameters
    ----------
    default: Vector
        The input vector that will be transformed into scalar data type.

    Returns
    -------
    Scalar
        The scalar that is generated from the given vector.
    """
    all_boolean = all(isinstance(element, bool_) for element in default.v)

    if all_boolean:
        binary_string = "".join(["1" if bit else "0" for bit in default.v])
        decimal_number = int(binary_string, 2)
        return Scalar(c=decimal_number)

    all_int = all(isinstance(element, int_) for element in default.v)

    if all_int:
        decimal_num = sum(element for element in default.v)
        return Scalar(c=decimal_num)

    raise ValueError("all elements of the vector must be in boolean or integer type")
