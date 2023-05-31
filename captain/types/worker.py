from typing import Any, Dict
from pydantic import BaseModel

class NodeResults:
    cmd: str
    id: str
    result: Dict[str, Any]

class WorkerJobResponse(BaseModel):
    SYSTEM_STATUS: str
    NODE_RESULTS: NodeResults
    RUNNING_NODE: str
    FAILURE_NODES: str
    FAILURE_REASON: str
    PRE_JOB_OP: Dict[str, Any]
    jobsetId: str
