import asyncio
import threading
import time

from queue import Queue
from typing import Any

from captain.internal.wsmanager import ConnectionManager
from captain.models.test_sequencer import MsgState, StatusTypes
from captain.models.topology import Topology
from captain.routes.cloud import utcnow_str
from captain.services.consumer.blocks_watcher import BlocksWatcher
from captain.types.test_sequence import TestSequenceMessage
from captain.types.worker import PoisonPill
from captain.utils.logger import logger

""" Acts as a bridge between backend components """


class WSManager:
    def __init__(self):
        self.ws = ConnectionManager()


# Manager for Test Sequencer activities
class TSManager(WSManager):
    def __init__(self):
        # holds the running sequencer (only one at a time)
        self.runner: asyncio.Runner | None = None
        self.pause = False
        self.poison_pill: PoisonPill | None = None
        super().__init__()

    def new_runner(self, runner: asyncio.Runner):
        if self.runner is not None:
            self.kill_runner()
        self.runner = runner
        self.pause = False
        self.poison_pill = None

    def cleanup(self):
        self.runner = None
        self.pause = False

    async def wait_if_paused(self, id_of_test_waiting_for_resume: str):
        logger.info(f"Check if paused: {self.pause}")
        if self.pause:
            logger.info("Sending pause message")
            await self.ws.broadcast(
                TestSequenceMessage(
                    state=MsgState.paused.value,
                    target_id=id_of_test_waiting_for_resume,
                    status=StatusTypes.paused.value,
                    time_taken=-1,
                    created_at=utcnow_str(),
                    is_saved_to_cloud=False,
                    error=None,
                )
            )
        while self.pause:
            logger.info("Waiting for pause to be lifted")
            if self.poison_pill is not None:
                logger.info("Poison pill detected")
                poison_pill = self.poison_pill
                self.poison_pill = None
                raise poison_pill
            time.sleep(0.5)

    def kill_runner(self):
        if self.runner is not None:
            logger.info("Killing TS Runner")
            try:
                self.poison_pill = PoisonPill()
                self.runner.close()
            except Exception:
                # Current Task can't be kill, but this put a "Poison Pill" in queue will stop the next task
                pass
            self.runner = None
            asyncio.run(
                self.ws.broadcast(
                    TestSequenceMessage(
                        MsgState.error.value,
                        "",
                        StatusTypes.aborted.value,
                        -1,
                        utcnow_str(),
                        False,
                        "Test sequence was interrupted",
                    )
                )
            )

    def pause_runner(self):
        if self.runner is not None:
            logger.info("Pausing TS Runner")
            self.pause = True

    def resume_runner(self):
        if self.pause:
            logger.info("Resuming TS Runner")
            self.pause = False


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
