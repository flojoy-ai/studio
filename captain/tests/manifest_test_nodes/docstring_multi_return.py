from flojoy import flojoy, OrderedPair, OrderedTriple
from typing import TypedDict


class DocstringMultiReturnOutput(TypedDict):
    output1: OrderedPair
    output2: OrderedTriple


@flojoy(node_type="TEST_TYPE")
def DOCSTRING_MULTI_RETURN(
    a: OrderedPair, b: OrderedPair
) -> DocstringMultiReturnOutput:
    """A docstring test.

    Returns
    -------
    output1 : OrderedPair
        Thing 1
    output2 : OrderedTriple
        Thing 2
    """
    return DocstringMultiReturnOutput(
        output1=OrderedPair(a.x + b.x, a.y + b.y),
        output2=OrderedTriple(a.x + b.x, a.y + b.y, a.x + b.x + a.y + b.y),
    )
