from fastapi import WebSocket
from multiprocessing import Process
from captain.utils.logger import logger
from captain.models.topology import Topology
from PYTHON.dao.redis_dao import RedisDao

class Manager(object):
    def __init__(self):
        self.ws = ConnectionManager()  # websocket manager
        self.running_topology: Topology | None = None
        self.redis_client = RedisDao() # TODO currently not needed, but very high probability to be needed in the future
        self.worker_processes : list[Process] = []
        self.debug_mode = False

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.debug(f"Connected! Amt of active connections: {len(self.active_connections)}")

    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.debug(f"Disconnected ;( ! Amt of active connections: {len(self.active_connections)}")

    # this method sends a message to all connected websockets
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except RuntimeError:
                await self.disconnect(connection)
                logger.error("RuntimeError in broadcast")
