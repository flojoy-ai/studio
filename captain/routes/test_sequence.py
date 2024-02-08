from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from captain.models.pytest.pytest_models import TestDiscoverContainer
from captain.utils.pytest.discover_tests import discover_pytest_file
from captain.utils.config import ts_manager
from captain.utils.test_sequencer.handle_data import handle_data
from captain.utils.logger import logger
from pydantic import BaseModel, Field

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


class DiscoverPytestParams(BaseModel):
    path: str
    one_file: bool = Field(..., alias="oneFile")


@router.get("/discover-pytest/")
async def discover_pytest(params: DiscoverPytestParams = Depends()):
    path = params.path
    one_file = params.one_file
    logger.info("access discover")
    return TestDiscoverContainer(
        response=discover_pytest_file(path, one_file)
    ).model_dump_json(by_alias=True)