from flojoy import flojoy, DataContainer, SmallMemory, NodeReference
from typing import Optional, Any

memory_key = "loop-info"


@flojoy
def BREAK(
    referred_node: NodeReference,
    default: Optional[DataContainer] = None,
) -> None:
    """End the iteration of a loop.

    It should be used in conjunction with conditionals to determine when to break the loop.
    It is needed to be able to generate 'while loops' in Flojoy (combined with an 'infinite loop').

    Parameters
    ----------
    referred_node : NodeReference
        This is the specific instance of a LOOP node that you want to break.
        It is required to differentiate between multiple LOOPs if they exist
        in the same application.
    default : DataContainer
        This node simply requires an input (most likely from
        the return of a CONDITIONAL node) so that it is executed.

    Returns
    -------
    None
    """

    # this is the loop ID we want to break
    original_data: dict[str, Any] = SmallMemory().read_memory(
        referred_node.ref, memory_key
    )
    data = original_data.copy()
    data["num_loop"] = 1
    data["current_iteration"] = 1
    data["is_finished"] = True
    SmallMemory().write_to_memory(referred_node.ref, memory_key, data)
    return default
