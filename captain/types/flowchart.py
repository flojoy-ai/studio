from pydantic import BaseModel


class PostCancelFC(BaseModel):
    fc: str
    jobset_id: str


class PostWFC(BaseModel):
    fc: str
    jobsetId: str | None = None
    cancelExistingJobs: bool
    extraParams: dict[str, str | float | int] 


class WorkerSuccessResponse(BaseModel):
    node_id: str
    result: dict


class WorkerFailedResponse(BaseModel):
    node_id: str
    result: dict
