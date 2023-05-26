from fastapi import APIRouter, WebSocket
from utils.config import manager

router = APIRouter()

#this does nothing for now except establish a websocket connection
@router.websocket("/ws/socket-server/")
async def websocket_endpoint(websocket: WebSocket):
    await manager.ws.connect(websocket)
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
