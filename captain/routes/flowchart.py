import asyncio
import json
from fastapi import APIRouter
import yaml
from captain.types.flowchart import PostCancelFC, PostWFC, WorkerSuccessResponse, WorkerFailedResponse
from captain.utils.flowchart_utils import (
    cancel_flowchart_by_id,
    create_topology,
)
from captain.utils.redis_dao import RedisDao
from captain.utils.config import manager

router = APIRouter(tags=["flowchart"])

running_topology = None

STATUS_CODES = yaml.load(
    open("STATUS_CODES.yml", "r", encoding="utf-8"), Loader=yaml.Loader
)

"""
FRONT-END CLIENT ACCESSIBLE END-POINTS
______________________________________

These end-points are accessible by the front-end client. They are used to
initiate processes on the back-end.
"""


@router.post("/cancel_fc/", summary="cancel flowchart")
async def cancel_flowchart(fc: PostCancelFC):
    jobset_id = fc.jobset_id
    cancel_flowchart_by_id(jobset_id)


@router.post("/wfc/", summary="write and run flowchart")
async def write_and_run_flowchart(request: PostWFC):
    # cancel any currently running flowchart
    if request.cancel_existing_jobs:
        cancel_flowchart_by_id(request.jobset_id)

    # connect to Redis and write the flowchart
    redis_client = RedisDao()

    # create the topology
    running_topology = create_topology(request.fc, redis_client)

    #create message for front-end
    msg = {
        "SYSTEM_STATUS": STATUS_CODES["RUN_PRE_JOB_OP"],
        "jobsetId": request.jobset_id,
        "FAILED_NODES": "",
        "RUNNING_NODES": "",
    }
    asyncio.run(manager.ws.broadcast(json.dumps(msg)))

    # run the flowhchart
    running_topology.run()


"""
BACK-END CLIENT ACCESSIBLE END-POINTS
_____________________________________

These end-points are accessible by the back-end client. They are used to implement
the event driven paradigm of the back-end. Workers that run jobs will poll these to 
signal a job has been finished.
"""


@router.post("/job_finished/", summary="job finished")
async def job_finished(resp: WorkerSuccessResponse):
    raise NotImplementedError("Function not implemented.")


@router.post("/job_failed/", summary="job failed")
async def job_failed(resp: WorkerFailedResponse):
    raise NotImplementedError("Function not implemented.")
