import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from captain.utils.config import manager
from captain.utils.status_codes import STATUS_CODES
from captain.utils.logger import logger

router = APIRouter(tags=["ws"])


@router.websocket("/ws/{socket_id}")
async def websocket_endpoint(websocket: WebSocket, socket_id: str):
    if socket_id in list(manager.ws.active_connections_map.keys()):
        logger.info("client {socket_id} is already connected!")
        return

    await manager.ws.connect(websocket, socket_id=socket_id)
    try:
        # send "Connection established" message to client
        await websocket.send_text(
            json.dumps(
                {
                    "type": "connection_established",
                    "msg": "You are now connected to flojoy servers",
                    "socketId": socket_id,
                    "SYSTEM_STATUS": STATUS_CODES["STANDBY"],
                }
            )
        )

        # await for messages and send messages (no need to read from frontend, this is used to keep connection alive)
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        await manager.ws.disconnect(socket_id=socket_id)
        logger.info(f"Client {socket_id} is disconnected")
