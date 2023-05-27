from fastapi import APIRouter, WebSocket
from captain.utils.config import manager_front_end

router = APIRouter(tags=["ws"])


# this does nothing for now except establish a websocket connection
@router.websocket("/ws/socket-server/")
async def websocket_endpoint(websocket: WebSocket):
    await manager_front_end.ws.connect(websocket)
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
