from queue import Queue
from threading import Thread
from fastapi import WebSocket
from captain.utils.logger import logger
from captain.models.topology import Topology
from captain.types.worker import JobInfo
from typing import Any, Union
import json
from captain.types.worker import WorkerJobResponse


""" Acts as a bridge between backend components """


class Manager(object):
    def __init__(self):
        self.ws = ConnectionManager()  # websocket manager
        self.running_topology: Topology | None = None  # holds the topology
        self.debug_mode = False
        self.task_queue: Queue = Queue()
        self.thread_count = 0
    
    # TODO: For some unknown mystical reason, this method doesn't kill the last thread...
    def end_worker_threads(self):
        for _ in range(self.thread_count):
            self.task_queue.put(JobInfo(terminate=True))

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
        for _, connection in self.active_connections_map.items():
            try:
                await connection.send_text(json.dumps(message))
            except RuntimeError:
                await self.disconnect(socket_id=socket_id)
                logger.error("RuntimeError in broadcast")
