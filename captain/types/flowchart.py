from pydantic import BaseModel


class PostCancelFC(BaseModel):
    fc: str
    jobset_id: str


class PostWFC(BaseModel):
    fc: str
    jobset_id: str
    cancel_existing_jobs: bool
    extraParams: dict


class WorkerResponse(BaseModel):
    node_id: str
    result: dict
