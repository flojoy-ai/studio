from flojoy import (
    flojoy,
    Scalar,
    OrderedPair,
    SmallMemory,
    NodeReference,
)
from typing import Optional


memory_key = "LOOP_INDEX"


@flojoy
def LOOP_INDEX(
    loop_node: NodeReference,
    default: Optional[OrderedPair | Scalar] = None,
) -> Scalar:
    """Load the loop index from the LOOP node.

    A loop index in Flojoy starts at 1 and increases by 1 for each loop.

    Parameters
    ----------
    loop_node : str
        The LOOP node to track the loop index from.

    Returns
    -------
    Scalar
        The loop index in Scalar form.
    """

    ref_loop_node = loop_node.unwrap()

    if ref_loop_node == "" or "LOOP" not in ref_loop_node:
        raise ValueError("A LOOP node id must be given.")

    loop_info = SmallMemory().read_memory(ref_loop_node, "loop-info")
    if loop_info is None:
        c = 1
    else:
        c = loop_info.get("current_iteration")

    return Scalar(c=float(c))
