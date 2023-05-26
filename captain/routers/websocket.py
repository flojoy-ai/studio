from fastapi import APIRouter, WebSocket
router = APIRouter()

@router.websocket("/ws/socket-server/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
