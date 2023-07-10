from typing import Any
from pydantic import BaseModel


class NodeResults(BaseModel):
    cmd: str
    id: str
    result: dict[str, Any]


class WorkerJobResponse(dict):
    SYSTEM_STATUS: str | None = None
    NODE_RESULTS: NodeResults | None = None
    RUNNING_NODE: str | None = None
    FAILED_NODES: str | None = None
    FAILURE_REASON: str | None = None
    PRE_JOB_OP: dict[str, Any] | None = None
    jobsetId: str = ""

    def __init__(
        self,
        jobset_id: str,
        sys_status: str | None = None,
        failed_nodes: list[str] = [],
        running_nodes: str = "",
        dict_item: dict[str, Any] = {},
    ):
        self["jobsetId"] = jobset_id
        if sys_status:
            self["SYSTEM_STATUS"] = sys_status
        self["type"] = "worker_response"
        self["FAILED_NODES"] = failed_nodes
        self["RUNNING_NODES"] = running_nodes
        for k, item in dict_item.items():
            self[k] = item

    def __setitem__(self, __key: Any, __value: Any) -> None:
        super().__setattr__(__key, __value)
        return super().__setitem__(__key, __value)
