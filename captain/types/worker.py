from typing import Any
from pydantic import BaseModel

class NodeResults(BaseModel):
    cmd: str
    id: str
    result: dict[str, Any]

class WorkerJobResponse(BaseModel):
    SYSTEM_STATUS: str
    NODE_RESULTS: NodeResults
    RUNNING_NODE: str
    FAILURE_NODES: str
    FAILURE_REASON: str
    PRE_JOB_OP: dict[str, Any]
    jobsetId: str
