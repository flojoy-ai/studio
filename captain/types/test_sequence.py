from enum import Enum
from typing import Any, Optional


class MsgState(Enum):
    TEST_SET_START = "TEST_SET_START"
    RUNNING = "RUNNING"
    TEST_DONE = "TEST_DONE"
    ERROR = "ERROR"
    TEST_SET_DONE = "TEST_SET_DONE"


class TestSequenceMessage(dict):
    """
    Special class that formats a proper response dict that matches
    the expected format of the front-end.
    """

    state: str
    target_id: str
    result: bool
    time_taken: float
    is_saved_to_cloud: bool
    error: Optional[str]

    def __init__(self, state, target_id, result, time_taken, is_saved_to_cloud, error):
        self["state"] = state
        self["target_id"] = target_id
        self["result"] = result
        self["time_taken"] = time_taken
        self["is_saved_to_cloud"] = is_saved_to_cloud
        self["error"] = error

    def __setitem__(self, __key: Any, __value: Any) -> None:
        super().__setattr__(__key, __value)
        return super().__setitem__(__key, __value)
