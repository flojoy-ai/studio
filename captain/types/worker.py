from typing import Any, TypedDict
from pydantic import BaseModel



# this Job class is used by the custom task queue
class JobInfo:
    def __init__(
        self,
        job_id: str = "",
        jobset_id: str = "",
        iteration_id: str = "",
        ctrls: dict[str, Any] | None = None,
        previous_jobs: list[dict[str, str]] | None = None,
        terminate: bool = False,
    ):
        self.job_id = job_id
        self.jobset_id = jobset_id
        self.iteration_id = iteration_id
        self.ctrls = ctrls or {}
        self.previous_jobs = previous_jobs or []
        self.terminate = terminate


class NodeResults(BaseModel):
    cmd: str
    id: str
    result: dict[str, Any]


class ModalConfig(dict):
    showModal: bool | None
    title: str | None
    messages: str | None
    id : str | None

class WorkerJobResponse(dict):
    SYSTEM_STATUS: str | None = None
    NODE_RESULTS: NodeResults | None = None
    RUNNING_NODE: str | None = None
    FAILED_NODES: dict[str, str] | None = None
    PRE_JOB_OP: dict[str, Any] | None = None
    jobsetId: str = ""
    MODAL_CONFIG : ModalConfig

    def __init__(
        self,
        jobset_id: str,
        sys_status: str | None = None,
        failed_nodes: dict[str, str] | None = None,
        running_node: str = "",
        dict_item: dict[str, Any] = {},
        modal_config: ModalConfig | None = None
    ):
        self["jobsetId"] = jobset_id
        if sys_status:
            self["SYSTEM_STATUS"] = sys_status
        self["type"] = "worker_response"
        self["FAILED_NODES"] = failed_nodes or {}
        self["RUNNING_NODE"] = running_node
        self["MODAL_CONFIG"] = modal_config or ModalConfig(showModal=False)
        for k, item in dict_item.items():
            self[k] = item

    def __setitem__(self, __key: Any, __value: Any) -> None:
        super().__setattr__(__key, __value)
        return super().__setitem__(__key, __value)
