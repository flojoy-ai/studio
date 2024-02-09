import json
import asyncio
from captain.utils.logger import logger
from captain.utils.test_sequencer.run_test_sequence import run_test_sequence


def _handle_subscribe(data):
    logger.info("TEST SEQUENCER WS CONNECTION TEST PASSED")


def _handle_run(data):
    asyncio.create_task(run_test_sequence(data["data"]["tree"]))


event_to_handle = {
    "subscribe": _handle_subscribe,
    "run": _handle_run,
}


def handle_data(json_str):
    """
    Handles the data received from the test sequencer websocket

    Parameters:
    data (string): the text received from the websocket
    """
    data = json.loads(json_str)
    event_to_handle[data["event"]](data)
