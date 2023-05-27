from pydantic import BaseModel

class PostCancelFC(BaseModel):
    fc: str
    jobsetId: str

class PostWFC(BaseModel):
    fc: str
    jobsetId: str
    cancelExistingJobs: bool
    extraParams: dict 

class WorkerResponse(BaseModel):
    nodeId: str
    result: dict