import json
import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from captain.utils.config import manager
from captain.utils.status_codes import STATUS_CODES
from captain.utils.logger import logger

router = APIRouter(tags=["ws"])


@router.websocket("/ws/socket-server/")
async def websocket_endpoint(websocket: WebSocket):
    await manager.ws.connect(websocket)
    try:
        # send "Connection established" message to client
        await websocket.send_text(
            json.dumps(
                {
                    "type": "connection_established",
                    "msg": "You are now connected to flojoy servers",
                    "socketId": str(uuid.uuid4()),
                    "SYSTEM_STATUS": STATUS_CODES["STANDBY"],
                }
            )
        )

        # await for messages and send messages (no need to read from frontend, this is used to keep connection alive)
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        logger.info("Client disconnected")
