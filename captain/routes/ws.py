import json
from fastapi import APIRouter, WebSocket
import yaml
from captain.utils.config import manager
from captain.utils.status_codes import STATUS_CODES

router = APIRouter(tags=["ws"])


# this does nothing for now except establish a websocket connection
@router.websocket("/ws/socket-server/")
async def websocket_endpoint(websocket: WebSocket):
    await manager.ws.connect(websocket)
    await manager.ws.broadcast(
        json.dumps(
            {
                "type": "connection_established",
                "msg": "You are now connected to flojoy servers",
                "SYSTEM_STATUS": STATUS_CODES["STANDBY"],
            }
        )
    )
