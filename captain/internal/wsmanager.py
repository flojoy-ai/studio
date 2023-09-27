from fastapi import WebSocket
from flojoy import PlotlyJSONEncoder

# removed logging for now to avoid circular imports
# may swich to loguru to handle loggings
# from captain.utils.logger import logger
from typing import Any, Union
import json
from captain.types.worker import WorkerJobResponse
import threading

socket_connection_lock = threading.Lock()


class ConnectionManager:
    def __init__(self):
        self.active_connections_map: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, socket_id: str):
        await websocket.accept()

        with socket_connection_lock:
            self.active_connections_map[socket_id] = websocket

        # logger.debug(
        #     f"Connected! Amt of active connections: {len(self.active_connections_map.keys())}"
        # )

    async def disconnect(self, socket_id: str):
        with socket_connection_lock:
            if socket_id not in self.active_connections_map:
                pass
                # logger.debug(f"Client {socket_id} was already disconnected, skipping")
                # return

            del self.active_connections_map[socket_id]

        # logger.debug(
        #     f"Client {socket_id} is Disconnected :( ! Amt of active connections: {len(self.active_connections_map.keys())}"
        # )

    # this method sends a message to all connected websockets
    async def broadcast(self, message: Union[dict[str, Any], WorkerJobResponse]):
        if not isinstance(message, WorkerJobResponse):
            return

        dead_connections = set()

        with socket_connection_lock:
            for id, connection in self.active_connections_map.items():
                if id in dead_connections:
                    continue

                try:
                    await connection.send_text(
                        json.dumps(message, cls=PlotlyJSONEncoder)
                    )
                except RuntimeError:
                    # logger.error(
                    #     f"RuntimeError in broadcast to {id}, adding to dead connections"
                    # )
                    dead_connections.add(id)

        for connection in dead_connections:
            # logger.error(
            #     f"Removing dead connection {connection} from active connections"
            # )
            await self.disconnect(socket_id=connection)
