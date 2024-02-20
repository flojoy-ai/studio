import asyncio
from captain.models.test_sequencer import TestSequenceEvents, TestSequenceRun
from captain.utils.logger import logger
from captain.utils.test_sequencer.run_test_sequence import export_test_sequence, run_test_sequence
from typing import Callable
from threading import Lock

lock = Lock()


def _handle_subscribe(data: TestSequenceRun):
    logger.info("TEST SEQUENCER WS CONNECTION TEST PASSED")


def _handle_run(data: TestSequenceRun):
    asyncio.run(run_test_sequence(data.data))


def _handle_export(data: TestSequenceRun):
    if data.hardware_id is None or data.project_id is None:
        raise ValueError("Please ensure both Hardware ID and Project ID are provided before exporting.")
    asyncio.run(export_test_sequence(data.data, data.hardware_id, data.project_id))


event_to_handle: dict[TestSequenceEvents, Callable[[TestSequenceRun], None]] = {
    "subscribe": _handle_subscribe,
    "run": _handle_run,
    "export": _handle_export
}


def handle_data(data: TestSequenceRun):
    """
    Handles the data received from the test sequencer websocket

    Parameters:
    data (string): the text received from the websocket
    """
    with lock:
        event_to_handle[data.event](data)
