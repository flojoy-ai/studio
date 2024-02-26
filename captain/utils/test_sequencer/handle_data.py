import asyncio
from captain.internal.manager import TSManager
from captain.models.test_sequencer import TestSequenceEvents, TestSequenceRun
from captain.utils.logger import logger
from captain.utils.test_sequencer.run_test_sequence import (
    export_test_sequence,
    run_test_sequence,
)
from typing import Callable
from threading import Lock
from captain.utils.config import ts_manager

lock = Lock()

def _handle_subscribe(_data: TestSequenceRun, _ts_manager: TSManager):
    logger.info("TEST SEQUENCER WS CONNECTION TEST PASSED")


def _handle_run(data: TestSequenceRun, ts_manager: TSManager):
    logger.info("Running test sequence")
    with asyncio.Runner() as runner:
        ts_manager.runner = runner
        runner.run(run_test_sequence(data.data))
    ts_manager.runner = None


def _handle_export(data: TestSequenceRun, ts_manager: TSManager):
    if data.hardware_id is None or data.project_id is None:
        raise ValueError(
            "Please ensure both Hardware ID and Project ID are provided before exporting."
        )
    with asyncio.Runner() as runner:
        runner.run(export_test_sequence(data.data, data.hardware_id, data.project_id))
        ts_manager.runner = runner
    ts_manager.runner = None


event_to_handle: dict[TestSequenceEvents, Callable[[TestSequenceRun, TSManager], None]] = {
    "subscribe": _handle_subscribe,
    "run": _handle_run,
    "stop": ts_manager.kill_runner,
    "export": _handle_export,
}


def handle_data(data: TestSequenceRun):
    """
    Handles the data received from the test sequencer websocket

    Parameters:
    data (string): the text received from the websocket
    """
    if data.event == "stop":
        ts_manager.kill_runner()
    with lock:
        event_to_handle[data.event](data, ts_manager)
