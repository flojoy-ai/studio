from flojoy import flojoy, DataContainer
from flojoy.job_result_builder import JobResultBuilder
import time
from typing import Optional, cast


@flojoy
def TIMER(
    default: Optional[DataContainer] = None,
    sleep_time: float = 0,
) -> DataContainer:
    """Sleep (pause program execution) for a specified number of seconds.

    Parameters
    ----------
    sleep_time : float
        number of seconds to sleep

    Returns
    -------
    Optional[DataContainer]
        Returns the input if one was passed in.
    """

    time.sleep(sleep_time)
    result = cast(
        DataContainer,
        JobResultBuilder().from_inputs([default] if default else []).build(),
    )

    return result
