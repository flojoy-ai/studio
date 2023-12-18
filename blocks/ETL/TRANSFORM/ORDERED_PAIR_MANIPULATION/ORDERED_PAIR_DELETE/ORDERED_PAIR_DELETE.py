from numpy import any, array, delete, arange
from flojoy import flojoy, OrderedPair, Array


@flojoy
def ORDERED_PAIR_DELETE(
    default: OrderedPair,
    indices: Array,
    length: int = 1,
) -> OrderedPair:
    """Returns an OrderedPair with elements deleted from requested indices.

    Deletes from both x and y axes.

    Parameters
    ----------
    default : OrderedPair
        The input OrderedPair to delete from
    indices: Array
        specified indices to delete value(s) at from the input OrderedPair
    length: int
        number of elements to delete from the input OrderedPair, default is 1 (this only applies when one index is specified for indices parameter)

    Returns
    -------
    OrderedPair
        The new OrderedPair with element(s) deleted from the input OrderedPair
    """

    # unwrap the indices first
    indices = array(indices.unwrap(), dtype=int)

    assert (
        len(default.x) > len(indices)
    ), "The length of indices parameter must be less than the length of the OrderedPair."
    assert any(indices >= 0), "The indices must be greater than zero."

    if len(indices) == 1:
        assert (
            (indices[0] + (length - 1)) < len(default.x)
        ), "The length of items to delete starting from index parameter must not exceed the length of the OrderedPair."

    if len(indices) > 1:
        x = delete(default.x, indices, None)
    else:
        indices = arange(indices[0], length)
        x = delete(default.x, indices, None)

    if len(indices) > 1:
        y = delete(default.y, indices, None)
    else:
        indices = arange(indices[0], length)
        y = delete(default.y, indices, None)

    return OrderedPair(x=x, y=y)
