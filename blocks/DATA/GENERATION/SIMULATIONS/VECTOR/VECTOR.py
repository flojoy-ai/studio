from flojoy import flojoy, Vector
from numpy import array
import numpy as np
from typing import Literal


@flojoy
def VECTOR(
    elements: str = "", elements_type: Literal["boolean", "numeric"] = "boolean"
) -> Vector:
    """Creates a vector type data given the elements

    Parameters
    ----------
    elements : str, default = ""
        The elements that should be in the vector

    Returns
    -------
    Vector
        The vector consists of the elements.
    """

    elements_list = elements.split(",")

    if elements_type == "boolean":
        all_bool = [element.lower() == "true" for element in elements_list]

        if all(isinstance(element, bool) for element in all_bool):
            return Vector(v=array(all_bool))

        raise ValueError(
            f"all elements of the vector must be in boolean type: {all_bool}"
        )

    elif elements_type == "numeric":
        all_numeric = []

        for element in elements_list:
            try:
                float_element = float(element)
                int_element = int(float_element)
                if float_element == int_element:
                    all_numeric.append(int_element)
                else:
                    all_numeric.append(float_element)

            except ValueError:
                raise ValueError(
                    f"all elements of the vector must be numeric: {element}"
                )

        return Vector(v=array(all_numeric, dtype=np.int16))

    raise ValueError("all elements of the vector must be in boolean or integer type")
