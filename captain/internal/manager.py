from queue import Queue
from typing import Any

from captain.internal.wsmanager import ConnectionManager
from captain.models.topology import Topology
from captain.types.worker import PoisonPill

""" Acts as a bridge between backend components """


class Manager(object):
    def __init__(self):
        self.ws = ConnectionManager.get_instance()  # websocket manager
        self.running_topology: Topology | None = None  # holds the topology
        self.debug_mode = False
        self.task_queue: Queue[Any] = Queue()
        self.finish_queue: Queue[Any] = Queue()
        self.thread_count = 0

    def end_worker_threads(self):
        for _ in range(self.thread_count):
            self.task_queue.put(PoisonPill())  # poison pill
            self.finish_queue.put(PoisonPill())  # poison pill
