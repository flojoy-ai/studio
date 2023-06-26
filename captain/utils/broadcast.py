from captain.internal.manager import Manager
from captain.utils.status_codes import STATUS_CODES
from captain.types.worker import WorkerJobResponse


async def broadcast_worker_response(manager: Manager, request_dict: dict):
    if request_dict.get("NODE_RESULTS", {}).get("cmd", "") == "END":
        request_dict["SYSTEM_STATUS"] = STATUS_CODES["STANDBY"]
    worker_response = WorkerJobResponse(
        jobset_id=request_dict.get("jobsetId", ""), dict_item=request_dict
    )
    # forward response from worker to the front-end
    await manager.ws.broadcast(worker_response)


async def signal_prejob_op(manager: Manager, jobsetId: str):
    msg = WorkerJobResponse(
        jobset_id=jobsetId, sys_status=STATUS_CODES["RUN_PRE_JOB_OP"]
    )
    await manager.ws.broadcast(msg)


async def signal_standby(manager: Manager, jobsetId: str):
    msg = WorkerJobResponse(jobset_id=jobsetId, sys_status=STATUS_CODES["STANDBY"])
    await manager.ws.broadcast(msg)
