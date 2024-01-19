from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from captain.utils.config import ts_manager
from captain.utils.test_sequencer.handle_data import handle_data
from captain.utils.logger import logger

router = APIRouter(tags=["ws"])


@router.websocket("/ts-ws/{socket_id}")
async def websocket_endpoint(websocket: WebSocket, socket_id: str):
    if socket_id in list(ts_manager.ws.active_connections_map.keys()):
        logger.info(f"client {socket_id} is already connected!")
        return

    await ts_manager.ws.connect(websocket, socket_id=socket_id)
    logger.info(f"Accepted websocket {socket_id}")
    try:
        # await for messages and send messages (no need to read from frontend, this is used to keep connection alive)
        while True:
            logger.info("*" * 20)
            data = await websocket.receive_text()
            handle_data(data)

    except WebSocketDisconnect:
        await ts_manager.ws.disconnect(socket_id=socket_id)
        logger.info(f"Client {socket_id} is disconnected")
