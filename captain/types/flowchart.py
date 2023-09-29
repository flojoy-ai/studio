from pydantic import BaseModel


class PostCancelFC(BaseModel):
    fc: str
    jobsetId: str | None = None


class PostWFC(BaseModel):
    fc: str
    jobsetId: str
    cancelExistingJobs: bool
    nodeDelay: float
    maximumRuntime: float
    maximumConcurrentWorkers: int


class WorkerSuccessResponse(BaseModel):
    node_id: str
    result: dict


class WorkerFailedResponse(BaseModel):
    node_id: str
    result: dict
