import json
from fastapi import APIRouter, Response
from captain.utils.config import manager
from captain.types.worker import WorkerJobResponse

router = APIRouter(tags=["flowchart"])


@router.post("/worker_response", summary="worker response")
async def worker_response(request: WorkerJobResponse):
    # forward response from worker to the front-end
    await manager.ws.broadcast(json.dumps(request))
    return Response(status_code=200)
