from typing import Any
from captain.internal.manager import ConnectionManager
from captain.utils.status_codes import STATUS_CODES
from captain.types.worker import WorkerJobResponse



async def broadcast_worker_response(ws: ConnectionManager, request_dict: dict):
    if request_dict.get("NODE_RESULTS", {}).get("cmd", "") == "END":
        request_dict["SYSTEM_STATUS"] = STATUS_CODES["STANDBY"]
    worker_response = WorkerJobResponse(
        jobset_id=request_dict.get("jobsetId", ""), dict_item=request_dict
    )
    # forward response from worker to the front-end
    await ws.broadcast(worker_response)

async def signal_node_results(ws: ConnectionManager, jobset_id: str, node_id: str, func_name: str ,result: dict[str, Any]):
    msg = WorkerJobResponse(
        jobset_id=jobset_id,
        result=result,
        cmd=func_name,
        node_id=node_id,
    )
    await ws.broadcast(msg)

async def signal_current_running_node(ws: ConnectionManager, jobset_id: str, node_id: str, func_name: str):
    msg = WorkerJobResponse(
        jobset_id=jobset_id,
        sys_status=STATUS_CODES["RUNNING_NODE"] + func_name,
        running_node=node_id,
    )
    await ws.broadcast(msg)

async def signal_failed_nodes(ws: ConnectionManager, jobset_id: str, node_id: str, func_name: str):
    msg = WorkerJobResponse(
        jobset_id=jobset_id,
        sys_status=STATUS_CODES["FAILED_NODE"] + func_name,
        failed_nodes={node_id: "FAILED"},
    )
    await ws.broadcast(msg)

async def signal_prejob_op(ws: ConnectionManager, jobset_id: str):
    msg = WorkerJobResponse(
        jobset_id=jobset_id, sys_status=STATUS_CODES["RUN_PRE_JOB_OP"]
    )
    await ws.broadcast(msg)


async def signal_standby(ws: ConnectionManager, jobset_id: str):
    msg = WorkerJobResponse(
        jobset_id=jobset_id,
        sys_status=STATUS_CODES["STANDBY"],
        failed_nodes=[],
        running_node="",
    )
    await ws.broadcast(msg)


async def signal_max_runtime_exceeded(ws: ConnectionManager, jobset_id: str):
    msg = WorkerJobResponse(
        jobset_id=jobset_id,
        sys_status=STATUS_CODES["MAXIMUM_RUNTIME_EXCEEDED"],
        failed_nodes=[],
        running_node="",
    )
    await ws.broadcast(msg)
