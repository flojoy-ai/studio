import asyncio
from captain.internal.manager import TSManager
from captain.models.test_sequencer import TestSequenceEvents, TestSequenceRun
from captain.utils.logger import logger
from captain.utils.test_sequencer.run_test_sequence import (
    run_test_sequence,
)
from typing import Callable
from threading import Lock
from captain.utils.config import ts_manager

lock = Lock()
global ts_pause


def _handle_subscribe(_data: TestSequenceRun, _ts_manager: TSManager):
    logger.info("TEST SEQUENCER WS CONNECTION TEST PASSED")


def _handle_run(data: TestSequenceRun, ts_manager: TSManager):
    logger.info("Running test sequence")
    with asyncio.Runner() as runner:
        ts_manager.new_runner(runner)
        runner.run(run_test_sequence(data.data, ts_manager))
    ts_manager.cleanup()


event_to_handle: dict[
    TestSequenceEvents, Callable[[TestSequenceRun, TSManager], None]
] = {
    "subscribe": _handle_subscribe,
    "run": _handle_run,
}


def handle_data(data: TestSequenceRun):
    """
    Handles the data received from the test sequencer websocket
    - Some event are trigger imeadiatly (run, stop, pause, resume)
    - Only one sequence or export can be run at the same time

    Parameters:
    data (string): the text received from the websocket
    """
    if data.event == "stop":
        ts_manager.kill_runner()
    elif data.event == "pause":
        ts_manager.pause_runner()
    elif data.event == "resume":
        ts_manager.resume_runner()
    else:
        with lock:
            event_to_handle[data.event](data, ts_manager)
