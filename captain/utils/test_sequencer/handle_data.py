import json
import asyncio
from captain.models.test_sequencer import TestSequenceEvents, TestSequenceRun
from captain.utils.logger import logger
from captain.utils.test_sequencer.run_test_sequence import run_test_sequence
from typing import Callable


def _handle_subscribe(data: TestSequenceRun):
    logger.info("TEST SEQUENCER WS CONNECTION TEST PASSED")


def _handle_run(data: TestSequenceRun):
    asyncio.create_task(run_test_sequence(data.data))


event_to_handle: dict[TestSequenceEvents, Callable[[TestSequenceRun], None]] = {
    "subscribe": _handle_subscribe,
    "run": _handle_run,
}


def handle_data(data: TestSequenceRun):
    """
    Handles the data received from the test sequencer websocket

    Parameters:
    data (string): the text received from the websocket
    """
    event_to_handle[data.event](data)
