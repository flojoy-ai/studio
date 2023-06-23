import json
from captain.internal.manager import Manager
from captain.utils.status_codes import STATUS_CODES


async def broadcast_worker_response(manager: Manager, request_dict: dict):
    request_dict["type"] = "worker_response"
    if request_dict.get("NODE_RESULTS", {}).get("cmd", "") == "END":
        request_dict["SYSTEM_STATUS"] = STATUS_CODES["STANDBY"]
    # forward response from worker to the front-end
    await manager.ws.broadcast(json.dumps(request_dict))
