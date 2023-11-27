from queue import Queue
from subprocess import Popen
import subprocess
from fastapi import WebSocket
from flojoy import PlotlyJSONEncoder
from captain.utils.logger import logger
from captain.models.topology import Topology
from captain.types.worker import PoisonPill
from typing import Any, Tuple, Union
import json
import threading
from captain.types.worker import WorkerJobResponse



socket_connection_lock = threading.Lock()

class Manager(object):
    """ Acts as a bridge between backend components """
    def __init__(self):
        self.ws = ConnectionManager()  # websocket manager
        self.running_topology: Topology | None = None  # holds the topology
        self.debug_mode = False
        self.task_queue: Queue[Any] = Queue()
        self.finish_queue: Queue[Any] = Queue()
        self.thread_count: int = 0
        self.mc_info: Tuple = () # holds the microcontroller info (port, mode)

    def end_worker_threads(self):
        """
        This function will end all producer/consumer threads by putting poison pills into the task and finish queues.
        """
        for _ in range(self.thread_count):
            self.task_queue.put(PoisonPill())  # poison pill
            self.finish_queue.put(PoisonPill())  # poison pill
    
    def set_mc(self, mc_proc: Popen, mc_port: str, play: bool = False):
        """
        This function will store the process object and the port of the currently running microcontroller for cancellation purposes
        """
        self.mc_info = (mc_proc, mc_port, play)

    def terminate_mc_proc(self):
        """
        This function terminates the microcontroller process (play or upload) and soft reboots the microcontroller.
        """
        try:
            mc_proc, mc_port, play = self.mc_info
        except ValueError:
            logger.warning("nothing to terminate")
            return  # mc_info not set
                
        if mc_proc:
            # terminate the microcontroller process
            logger.debug("terminating mc...")
            mc_proc.terminate()
            mc_proc.wait(5) # wait for process to terminate 
            if mc_proc.returncode != 0:
                logger.error("mc terminated with non-zero exit code or timeout")
            else:
                logger.debug("terminated mc")

            if play: # this means "play" was pressed
                # soft reboot the microcontroller
                logger.debug("resetting mc...")
                stderr = subprocess.run(["mpremote", "connect", mc_port, "+", "reset"], stderr=subprocess.PIPE).stderr.decode()
                if (stderr != ""):
                    logger.error(f"reset failed: {stderr}")
                else:
                    logger.debug("reset mc")

            self.mc_info = () # reset mc_info
            

        


class ConnectionManager:
    def __init__(self):
        self.active_connections_map: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, socket_id: str):
        await websocket.accept()

        with socket_connection_lock:
            self.active_connections_map[socket_id] = websocket

        logger.debug(
            f"Connected! Amt of active connections: {len(self.active_connections_map.keys())}"
        )

    async def disconnect(self, socket_id: str):
        with socket_connection_lock:
            if socket_id not in self.active_connections_map:
                logger.debug(f"Client {socket_id} was already disconnected, skipping")
                return

            del self.active_connections_map[socket_id]

        logger.debug(
            f"Client {socket_id} is Disconnected :( ! Amt of active connections: {len(self.active_connections_map.keys())}"
        )

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
                    logger.error(
                        f"RuntimeError in broadcast to {id}, adding to dead connections"
                    )
                    dead_connections.add(id)

        for connection in dead_connections:
            logger.error(
                f"Removing dead connection {connection} from active connections"
            )
            await self.disconnect(socket_id=connection)
