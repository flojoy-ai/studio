from enum import Enum
from typing import Any, Optional


class MsgState(Enum):
    test_set_start = "test_set_start"
    test_set_export = "test_set_export"
    running = "running"
    pause = "pause"
    test_done = "test_done"
    error = "error"
    test_set_done = "test_set_done"


class TestSequenceMessage(dict):
    """
    Special class that formats a proper response dict that matches
    the expected format of the front-end.
    """

    state: str
    target_id: str
    status: str
    time_taken: float
    created_at: str
    is_saved_to_cloud: bool
    error: Optional[str]
    value: Optional[float]

    def __init__(
        self,
        state,
        target_id,
        status,
        time_taken,
        created_at,
        is_saved_to_cloud,
        error,
        value,
    ):
        self["state"] = state
        self["target_id"] = target_id
        self["status"] = status
        self["time_taken"] = time_taken
        self["created_at"] = created_at
        self["is_saved_to_cloud"] = is_saved_to_cloud
        self["error"] = error
        self["value"] = value

    def __setitem__(self, __key: Any, __value: Any) -> None:
        super().__setattr__(__key, __value)
        return super().__setitem__(__key, __value)
