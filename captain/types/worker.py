from pydantic import BaseModel


class WorkerJobResponse(BaseModel):
    SYSTEM_STATUS: str
    NODE_RESULTS: dict
    RUNNING_NODE: str
    FAILURE_NODES: str
    FAILURE_REASON: str
    PRE_JOB_OP: dict
    jobsetId: str