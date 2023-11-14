from pydantic import BaseModel


class PostCancelFC(BaseModel):
    fc: str
    jobsetId: str | None = None
    precompile: bool = False


class PostWFC(BaseModel):
    fc: str
    jobsetId: str
    cancelExistingJobs: bool
    nodeDelay: float
    maximumRuntime: float
    precompile: bool
    selectedPort: str
    maximumConcurrentWorkers: int


class WorkerSuccessResponse(BaseModel):
    node_id: str
    result: dict


class WorkerFailedResponse(BaseModel):
    node_id: str
    result: dict
