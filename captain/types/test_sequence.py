from typing import Any


class TestSequenceMessage(dict):
    """
    Special class that formats a proper response dict that matches
    the expected format of the front-end.
    """

    state: str
    target_id: str
    result: str
    time_taken: float

    def __init__(self, state, target_id, result="", time_taken=0):
        self["state"] = state
        self["target_id"] = target_id
        self["result"] = result
        self["time_taken"] = time_taken

    def __setitem__(self, __key: Any, __value: Any) -> None:
        super().__setattr__(__key, __value)
        return super().__setitem__(__key, __value)
