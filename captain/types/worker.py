from typing import Any
from pydantic import BaseModel


class NodeResults(BaseModel):
    cmd: str
    id: str
    result: dict[str, Any]


class WorkerJobResponse(BaseModel):
    SYSTEM_STATUS: str | None = None
    NODE_RESULTS: NodeResults | None = None
    RUNNING_NODE: str | None = None
    FAILED_NODES: str | None = None
    FAILURE_REASON: str | None = None
    PRE_JOB_OP: dict[str, Any] | None = None
    jobsetId: str | None = None
