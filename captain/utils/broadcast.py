import asyncio
import json
from captain.internal.manager import Manager
from captain.types.flowchart import PostWFC
from captain.utils.status_codes import STATUS_CODES


async def broadcast_worker_response(manager: Manager, request_dict: dict):
    request_dict["type"] = "worker_response"
    if request_dict.get("NODE_RESULTS", {}).get("cmd", "") == "END":
        request_dict["SYSTEM_STATUS"] = STATUS_CODES["STANDBY"]
    # forward response from worker to the front-end
    await manager.ws.broadcast(json.dumps(request_dict))

async def signal_prejob_op(manager: Manager, jobsetId: str):
    msg = {
        "SYSTEM_STATUS": STATUS_CODES["RUN_PRE_JOB_OP"],
        "jobsetId": jobsetId,
        "type": "worker_response",  # TODO modify frontend such that this field isn't required for switching playBtn state
        "FAILED_NODES": "",
        "RUNNING_NODES": "",
    }
    await manager.ws.broadcast(json.dumps(msg))

async def signal_standby(manager: Manager, jobsetId: str):
    msg = {
        "SYSTEM_STATUS": STATUS_CODES["STANDBY"],
        "jobsetId": jobsetId,
        "type": "worker_response",  # TODO modify frontend such that this field isn't required for switching playBtn state
        "FAILED_NODES": "",
        "RUNNING_NODES": "",
    }
    await manager.ws.broadcast(json.dumps(msg))