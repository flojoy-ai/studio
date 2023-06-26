from fastapi import WebSocket
from multiprocessing import Process
from captain.utils.logger import logger
from captain.models.topology import Topology
from typing import Any, Union
import json
from captain.types.worker import WorkerJobResponse

""" Acts as a bridge between backend components """


class Manager(object):
    def __init__(self):
        self.ws = ConnectionManager()  # websocket manager
        self.running_topology: Topology | None = None  # holds the topology
        self.worker_processes: list[Process] = []
        self.debug_mode = False


class ConnectionManager:
    def __init__(self):
        self.active_connections_map: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, socket_id: str):
        await websocket.accept()
        self.active_connections_map[socket_id] = websocket
        logger.debug(
            f"Connected! Amt of active connections: {len(self.active_connections_map.keys())}"
        )

    async def disconnect(self, socket_id: str):
        self.active_connections_map.__delitem__(socket_id)
        logger.debug(
            f"Client {socket_id} is Disconnected :( ! Amt of active connections: {len(self.active_connections_map.keys())}"
        )

    # this method sends a message to all connected websockets
    async def broadcast(self, message: Union[dict[str, Any], WorkerJobResponse]):
        if not isinstance(message, WorkerJobResponse):
            return
        socket_id = message.jobsetId
        for _id, connection in self.active_connections_map.items():
            if _id != socket_id:
                return
            try:
                await connection.send_text(json.dumps(message))
            except RuntimeError:
                await self.disconnect(socket_id=socket_id)
                logger.error("RuntimeError in broadcast")
