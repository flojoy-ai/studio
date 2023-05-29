from fastapi import APIRouter, WebSocket
from captain.utils.config import manager

router = APIRouter(tags=["ws"])


# this does nothing for now except establish a websocket connection
@router.websocket("/ws/socket-server/")
async def websocket_endpoint(websocket: WebSocket):
    print("websocket connection established")
    await manager.ws.connect(websocket)
