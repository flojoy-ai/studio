from typing import Any, Optional

from flojoy import (
    DataContainer,
    JobResultBuilder,
    NodeReference,
    flojoy,
    get_job_result,
)


@flojoy
def FEEDBACK(
    referred_node: NodeReference,
    default: Optional[DataContainer] = None,
) -> Any:
    """Capture and save the results of a specified block over time. This block is almost always used in a LOOP.

    If the result is not found, it passes the result of the parent node.

    Parameters
    ----------
    referred_node : str
        The node ID to capture the result from.

    Returns
    -------
    DataContainer
        The result of the specified node ID, or the result of the parent node if it was not found.
    """

    result = get_job_result(referred_node.ref)
    if result:
        return result
    else:
        return (
            JobResultBuilder()
            .from_inputs([default] if default else [])
            .flow_to_directions(["default"])
            .build()
        )
