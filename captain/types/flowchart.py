from pydantic import BaseModel


class PostCancelFC(BaseModel):
    jobsetId: str | None = None


class PostWFC(BaseModel):
    fc: str
    jobsetId: str
    cancelExistingJobs: bool
    observeBlocks: list[str]
    nodeDelay: float
    maximumRuntime: float
    maximumConcurrentWorkers: int


class WorkerSuccessResponse(BaseModel):
    node_id: str
    result: dict


class WorkerFailedResponse(BaseModel):
    node_id: str
    result: dict
