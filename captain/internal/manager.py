from queue import Queue
from typing import Any

from captain.internal.wsmanager import ConnectionManager
from captain.models.test_sequencer import MsgState
from captain.models.topology import Topology
from captain.types.test_sequence import TestSequenceMessage
from captain.types.worker import PoisonPill
import threading
from captain.services.consumer.blocks_watcher import BlocksWatcher
from captain.utils.logger import logger
import asyncio

""" Acts as a bridge between backend components """


class WSManager:
    def __init__(self):
        self.ws = ConnectionManager()


# Manager for Test Sequencer activities
class TSManager(WSManager):
    def __init__(self):
        self.runner: asyncio.Runner | None = None  # holds the running sequencer
        super().__init__()

    def kill_runner(self, *args, **kwargs):
        if self.runner is not None:
            logger.info("Killing TS Runner")
            try:
                self.runner.close()
            except Exception as e:
                # Current Task can't be kill, but a PoisonPill in queue will stop the next task
                logger.error(f"Error while killing TS Runner: {e}")
            self.runner = None
            asyncio.run(
                self.ws.broadcast(
                    TestSequenceMessage(
                        MsgState.ERROR.value,
                        "",
                        False,
                        -1,
                        False,
                        "Test sequence was interrupted",
                    )
                )
            )


# Manager for flowchart activities (main manager)
class Manager(WSManager):
    def __init__(self):
        super().__init__()
        self.running_topology: Topology | None = None  # holds the topology
        self.debug_mode = False
        self.task_queue: Queue[Any] = Queue()
        self.finish_queue: Queue[Any] = Queue()
        self.thread_count = 0

    def end_worker_threads(self):
        for _ in range(self.thread_count):
            self.task_queue.put(PoisonPill())  # poison pill
            self.finish_queue.put(PoisonPill())  # poison pill


class WatchManager(object):
    _instance = None

    @classmethod
    def get_instance(cls):
        if not cls._instance:
            cls._instance = WatchManager()
            return cls._instance
        return cls._instance

    def __init__(self) -> None:
        self.create_new_thread()

    def create_new_thread(self):
        block_watcher = BlocksWatcher()

        async def run_services(stop_flag: threading.Event):
            await block_watcher.run(stop_flag)

        logger.info("Starting thread for startup event")
        self.thread_event = threading.Event()
        thread = threading.Thread(
            target=lambda: asyncio.run(run_services(self.thread_event))
        )
        thread.daemon = True
        self.watch_thread = thread
        self.is_thread_running = False

    def start_thread(self):
        self.watch_thread.start()
        self.is_thread_running = True

    def restart(self):
        if self.is_thread_running:
            self.thread_event.set()
            self.create_new_thread()
            self.start_thread()
