import asyncio
import json
from fastapi import APIRouter, Request, Response
import time
from captain.types.flowchart import (
    PostCancelFC,
    PostWFC,
)
from captain.utils.broadcast import broadcast_worker_response
from captain.utils.flowchart_utils import (
    create_topology,
    spawn_workers,
)
from captain.utils.config import manager
from captain.utils.status_codes import STATUS_CODES
from captain.utils.logger import logger

router = APIRouter(tags=["flowchart"])


"""
FRONT-END CLIENT ACCESSED END-POINTS
______________________________________

These end-points are accessed by the front-end client. They are used to
initiate processes on the back-end.
"""

# TODO do we want to convert field names from camelCase to snake_case?

@router.post("/cancel_fc", summary="cancel flowchart")
async def cancel_fc(req: PostCancelFC):
    logger.info("Cancelling flowchart...")
    if manager.running_topology is not None:
        manager.running_topology.cancel()
    msg = {
        "SYSTEM_STATUS": STATUS_CODES["STANDBY"],
        "jobsetId": req.jobsetId,
        "type": "worker_response", # TODO modify frontend such that this field isn't required for switching playBtn state 
        "FAILED_NODES": "",
        "RUNNING_NODES": "",
    }
    asyncio.create_task(manager.ws.broadcast(json.dumps(msg)))


@router.post("/wfc", summary="write and run flowchart")
async def write_and_run_flowchart(request: PostWFC):

    # create the topology
    manager.running_topology = create_topology(request, manager.redis_client, manager.worker_processes)

    # create message for front-end
    msg = {
        "SYSTEM_STATUS": STATUS_CODES["RUN_PRE_JOB_OP"],
        "jobsetId": request.jobsetId,
        "FAILED_NODES": "",
        "RUNNING_NODES": "",
    }
    asyncio.create_task(manager.ws.broadcast(json.dumps(msg)))

    # get the amount of workers needed
    spawn_workers(manager)
    time.sleep(1) # OPTIONAL. Give workers time to start. Not really needed, only because job is queued before the worker actually starts. Prevents slow start.

    # run the flowchart
    asyncio.create_task(manager.running_topology.run())


"""
BACK-END CLIENT ACCESSED END-POINTS
_____________________________________

These end-points are accessed by the back-end client. They are used to implement
the event driven paradigm of the back-end. Workers that run jobs will poll these to 
signal a job has been finished.
"""

@router.post("/worker_response", summary="worker response")
async def worker_response(request: Request): # TODO figure out way to use Pydantic model, for now use type Request otherwise does not work???? 

    if manager.running_topology is not None and manager.running_topology.is_cancelled():
        return Response(status_code=200)

    logger.debug("Received a response from a worker")

    request_json = await request.json()
    request_dict = json.loads(request_json)

    # broadcast worker response to frontend
    asyncio.create_task(broadcast_worker_response(manager, request_dict))

    if "NODE_RESULTS" in request_dict:
        job_id: str = request_dict.get('NODE_RESULTS', {}).get('id', None)
        print(f"{job_id} finished at {time.time()}")
        asyncio.create_task(manager.running_topology.handle_finished_job(request_dict)) # type: ignore

    return Response(status_code=200)

