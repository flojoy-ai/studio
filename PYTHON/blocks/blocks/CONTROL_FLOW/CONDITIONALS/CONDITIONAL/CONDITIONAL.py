from typing import Any, Literal, TypedDict

from flojoy import JobResultBuilder, Scalar, flojoy


class ConditionalOutput(TypedDict):
    true: Any
    false: Any


@flojoy
def CONDITIONAL(
    x: Scalar,
    y: Scalar,
    operator_type: Literal["<=", ">", "<", ">=", "!=", "=="] = ">=",
) -> ConditionalOutput:
    """Compare two given Scalar inputs.

    We are planning to add support for more DataContainer types in the future.

    It then enqueues nodes connected with a "true" or "false" output based on the comparison result.

    Parameters
    ----------
    operator_type : select
        Specifies the type of comparison to be performed between the two inputs. The default value is ">=".

    Returns
    -------
    true : DataContainer
        Forwards the first value to the true branch.
    False : DataContainer
        Forwards the second value to the false branch.
    """

    # y_of_x = x.y
    # y_of_y = y.y

    bool_ = compare_values(x.c, y.c, operator_type)
    data = None
    if bool_:
        data = x
    else:
        data = y

    # if operator_type in ["<=", "<"]:
    #     if not bool_:
    #         data = OrderedPair(x=x.x, y=y.y)
    #     else:
    #         data = OrderedPair(x=y.x, y=x.y)
    # elif bool_:
    #     data = OrderedPair(x=x.x, y=y.y)
    # else:
    #     data = OrderedPair(x=y.x, y=x.y)

    next_direction = str(bool_).lower()

    return ConditionalOutput(
        true=JobResultBuilder()
        .from_data(data)
        .flow_to_directions([next_direction])
        .build(),
        false=JobResultBuilder()
        .from_data(data)
        .flow_to_directions([next_direction])
        .build(),
    )


def compare_values(first_value: Any, second_value: Any, operator: str):
    bool_: bool = False
    if operator == "<=":
        bool_ = first_value <= second_value
    elif operator == ">":
        bool_ = first_value > second_value
    elif operator == "<":
        bool_ = first_value < second_value
    elif operator == ">=":
        bool_ = first_value >= second_value
    elif operator == "!=":
        bool_ = first_value != second_value
    else:
        bool_ = first_value == second_value
    return bool_
