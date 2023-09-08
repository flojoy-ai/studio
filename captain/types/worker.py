from queue import Queue
from typing import Any, Callable, Union

from flojoy import JobFailure, JobSuccess

class PoisonPill:
    pass

# this Job class is used by the custom task queue
class JobInfo:
    def __init__(
        self,
        job_id: str = "",
        jobset_id: str = "",
        iteration_id: str = "",
        ctrls: dict[str, Any] | None = None,
        previous_jobs: list[dict[str, str]] | None = None,
    ):
        self.job_id = job_id
        self.jobset_id = jobset_id
        self.iteration_id = iteration_id
        self.ctrls = ctrls or {}
        self.previous_jobs = previous_jobs or []

class NodeResults(dict):
    cmd: str
    id: str
    result: dict[str, Any]


class ModalConfig(dict):
    showModal: bool | None
    title: str | None
    messages: str | None
    description: str | None
    id: str | None


class WorkerJobResponse(dict):
    """
    Special class that formats a proper response dict that matches
    the expected format of the front-end.
    """
    SYSTEM_STATUS: str | None = None
    NODE_RESULTS: NodeResults | None = None
    RUNNING_NODE: str | None = None
    FAILED_NODES: dict[str, str] | None = None
    PRE_JOB_OP: dict[str, Any] | None = None
    jobsetId: str = ""
    MODAL_CONFIG: ModalConfig

    def __init__(
        self,
        jobset_id: str,
        sys_status: str | None = None,
        failed_nodes: dict[str, str] | None = None,
        running_node: str = "",
        dict_item: dict[str, Any] = {},
        modal_config: ModalConfig | None = None,
        result: dict[str, Any] | None = None,
        cmd: str | None = None,
        node_id: str | None = None,
    ):
        self["jobsetId"] = jobset_id
        if sys_status:
            self["SYSTEM_STATUS"] = sys_status
        self["type"] = "worker_response"
        self["FAILED_NODES"] = failed_nodes or {}
        self["RUNNING_NODE"] = running_node
        self["MODAL_CONFIG"] = modal_config or ModalConfig(showModal=False)
        if result is not None and cmd is not None and node_id is not None:
            self["NODE_RESULTS"] = NodeResults(cmd=cmd, id=node_id, result=result)
        for k, item in dict_item.items():
            self[k] = item
    
    def __setitem__(self, __key: Any, __value: Any) -> None:
        super().__setattr__(__key, __value)
        return super().__setitem__(__key, __value)
    
ProcessTaskType = Callable[[Union[JobSuccess, JobFailure]], list[JobInfo]]
QueueTaskType = Callable[[JobInfo, Queue], None]
InitFuncType = Callable[[Queue], None]