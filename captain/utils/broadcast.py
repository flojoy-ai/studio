import json
from captain.internal.manager import Manager


async def broadcast_worker_response(manager: Manager, request_dict: dict):
    request_dict["type"] = "worker_response"
    # forward response from worker to the front-end
    await manager.ws.broadcast(json.dumps(request_dict))